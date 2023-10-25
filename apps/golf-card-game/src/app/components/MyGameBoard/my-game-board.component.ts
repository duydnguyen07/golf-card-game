import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  SimpleChanges,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CardGridView,
  CardPosition,
  ClientSocketAction,
  RevealCardPayload,
  SwapCardPayload,
} from '@golf-card-game/interfaces';
import { CardColumnComponent } from '../CardColumn/card-column.component';
import { TotalPointsPipe } from '../../pipes/total-points.pipe';
import { UserService } from '../../user.service';
import { RoomService } from '../../room.service';
import { GameBoardService } from '../../game-board.service';

@Component({
  selector: 'golf-card-game-my-game-board',
  standalone: true,
  imports: [CommonModule, CardColumnComponent, TotalPointsPipe],
  templateUrl: './my-game-board.component.html',
  styleUrls: ['./my-game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyGameBoardComponent {
  currentPlayerGameBoard: Signal<{
    playerName: string;
    cardGrid: CardGridView;
  } | null> = computed(() => {
    const gameBoard = this.gameBoardService.gameBoard();
    return gameBoard.players[this.userService.userId()];
  });

  constructor(
    public userService: UserService,
    public gameBoardService: GameBoardService,
    private roomService: RoomService
  ) {}

  revealCard(
    columnIndex: number,
    event: {
      cardPositionIndex: number;
    }
  ) {
    const cardPosition: CardPosition = {
      columnIndex,
      cardPositionIndex: event.cardPositionIndex,
    };
    const payload: RevealCardPayload = {
      action: ClientSocketAction.RevealCard,
      room: this.roomService.ROOM_NAME,
      playerId: this.userService.userId(),
      cardPosition,
    };

    this.userService.websocketSubject.next(payload);
  }

  swapCard(
    columnIndex: number,
    event: {
      cardPositionIndex: number;
    }
  ) {
    const cardPosition: CardPosition = {
      columnIndex,
      cardPositionIndex: event.cardPositionIndex,
    };

    const payload: SwapCardPayload = {
      action: ClientSocketAction.SwapCard,
      room: this.roomService.ROOM_NAME,
      playerId: this.userService.userId(),
      cardPosition,
    };

    this.userService.websocketSubject.next(payload);
  }
}
