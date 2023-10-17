import {
  Component,
  ChangeDetectionStrategy,
  computed,
  Signal,
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
} from '@golf-card-game/interfaces';
import { HttpClientModule } from '@angular/common/http';
import { WebSocketSubject } from 'rxjs/webSocket';
import { UserService } from './user.service';
import { RoomService } from './room.service';
import { CommonModule } from '@angular/common';
import { GameBoardService } from './game-board.service';
import { MyGameBoardComponent } from './components/MyGameBoard/my-game-board.component';
import { OthersGameBoardComponent } from './components/OthersGameBoard/others-game-board.component';

@Component({
  standalone: true,
  imports: [
    OthersGameBoardComponent,
    RouterModule,
    HttpClientModule,
    CommonModule,
    MyGameBoardComponent,
  ],
  selector: 'golf-card-game-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'golf-card-game';
  ROOM_NAME = '123'; //TODO: make this room name unique
  currentPlayerGameBoard: Signal<{
    playerName: string;
    cardGrid: CardGridView;
  } | null> = computed(() => {
    const gameBoard = this.gameBoardService.gameBoard();
    return gameBoard.players[this.userService.userId()];
  });
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
    public roomService: RoomService
  ) {
    this.initSocketConnection(this.userService.websocketSubject);
  }

  deal() {
    this.gameBoardService.reset();
    this.userService.websocketSubject.next({
      passThroughMessage: null,
      action: ClientSocketAction.StartGame,
      room: this.ROOM_NAME,
      playerId: this.userService.userId(),
    });
  }

  private initSocketConnection(subject: WebSocketSubject<SocketPayload>) {
    subject.subscribe({
      next: (message) => {
        if (message.action === ServerSocketAction.JoinedSuccess) {
          this.userService.setUserId(message.playerId);
        } else if (message.action === ServerSocketAction.NewPlayerJoinedSuccess) {
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
        }
      },
      error: (err) => console.error(err),
      complete: () => console.log('completed!'),
    });

    this.joinRoom(subject);
  }

  private joinRoom(subject: WebSocketSubject<SocketPayload>) {
    const socketPayload: SocketJoinPayload = {
      playerName: Math.random() + '',
      playerId: '',
      passThroughMessage: null,
      action: ClientSocketAction.Join,
      room: this.ROOM_NAME,
    };
    subject.next(socketPayload);
  }
}
