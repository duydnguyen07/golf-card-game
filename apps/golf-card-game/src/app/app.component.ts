import {
  Component,
  ChangeDetectionStrategy,
  computed,
  Signal,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CardGridView,
  NewPlayerJoinedSuccessPayload,
  SetPlayerHandPayload,
  ClientSocketAction,
  SocketJoinPayload,
  SocketPayload,
  ServerSocketAction,
  SetDrawnCardPayload,
  CardPosition,
  RevealCardPayload,
  SetRevealedCardPayload,
  SetLastRoundPayload,
  GameEndedPayload,
} from '@golf-card-game/interfaces';
import { HttpClientModule } from '@angular/common/http';
import { WebSocketSubject } from 'rxjs/webSocket';
import { UserService } from './user.service';
import { RoomService } from './room.service';
import { CommonModule } from '@angular/common';
import { GameBoardService } from './game-board.service';
import { MyGameBoardComponent } from './components/MyGameBoard/my-game-board.component';
import { OthersGameBoardComponent } from './components/OthersGameBoard/others-game-board.component';
import { CenterDeckComponent } from './components/CenterDeck/center-deck.component';

@Component({
  standalone: true,
  imports: [
    OthersGameBoardComponent,
    RouterModule,
    HttpClientModule,
    CommonModule,
    MyGameBoardComponent,
    CenterDeckComponent,
  ],
  selector: 'golf-card-game-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  otherPlayerBoards: Signal<
    {
      playerId: string;
      playerName: string;
      cardGrid: CardGridView;
    }[]
  > = computed(() => {
    const gameBoard = this.gameBoardService.gameBoard();
    return Object.entries(gameBoard.players)
      .filter(([playerId]) => playerId !== this.userService.userId())
      .map(([playerId, playerProfile]) => {
        return {
          playerId,
          playerName: playerProfile.playerName,
          cardGrid: playerProfile.cardGrid,
        };
      });
  });

  constructor(
    public userService: UserService,
    public gameBoardService: GameBoardService,
    public roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) {
    this.initSocketConnection(this.userService.websocketSubject);
  }

  deal() {
    this.gameBoardService.reset();
    this.userService.websocketSubject.next({
      action: ClientSocketAction.StartGame,
      room: this.roomService.ROOM_NAME,
      playerId: this.userService.userId(),
    });
  }

  revealAllCards() {
    const payload: SocketPayload = {
      action: ClientSocketAction.RevealAllCards,
      room: this.roomService.ROOM_NAME,
      playerId: this.userService.userId(),
    };

    this.userService.websocketSubject.next(payload);
  }

  private initSocketConnection(subject: WebSocketSubject<SocketPayload>) {
    subject.subscribe({
      next: (message) => {
        if (message.action === ServerSocketAction.JoinedSuccess) {
          this.userService.setUserId(message.playerId);
        } else if (
          message.action === ServerSocketAction.NewPlayerJoinedSuccess
        ) {
          this.roomService.addPlayer(
            (message as NewPlayerJoinedSuccessPayload).playerName,
            message.playerId
          );
        } else if (message.action === ServerSocketAction.ExistingPlayerLeft) {
          this.roomService.removePlayer(message.playerId);
        } else if (message.action === ServerSocketAction.SetPlayerHand) {
          this.gameBoardService.setPlayerHand(message.playerId, {
            playerName: (message as SetPlayerHandPayload).playerName,
            cardGrid: (message as SetPlayerHandPayload).cardGrid,
          });
        } else if (message.action === ServerSocketAction.SetDrawnCard) {
          this.gameBoardService.setDrawnCard(
            (message as SetDrawnCardPayload).drawnCard
          );
        } else if (message.action === ServerSocketAction.SetPlayerTurn) {
          this.gameBoardService.setCurrentTurnPlayerId(message.playerId);
          this.cdr.detectChanges();
        } else if (message.action === ServerSocketAction.SetRevealedCard) {
          this.gameBoardService.setRevealedCard(
            message.playerId,
            (message as SetRevealedCardPayload).revealedCard,
            (message as SetRevealedCardPayload).cardPosition
          );
          this.cdr.detectChanges();
        } else if (message.action === ServerSocketAction.SetLastRound) {
          this.gameBoardService.setLastRound(true);
          this.cdr.detectChanges();
        } else if (message.action === ServerSocketAction.GameEnded) {
          this.gameBoardService.setWinnerName(
            (message as GameEndedPayload).playerName
          );
          this.gameBoardService.setWinnerId(message.playerId);
          this.gameBoardService.setGameOver(true);
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error(err),
      complete: () => console.log('completed!'),
    });

    this.joinRoom(subject);
  }

  private joinRoom(subject: WebSocketSubject<SocketPayload>) {
    const socketPayload: SocketJoinPayload = {
      playerName: this.userService.PLAYER_NAME,
      playerId: '',
      action: ClientSocketAction.Join,
      room: this.roomService.ROOM_NAME,
    };
    subject.next(socketPayload);
  }
}
