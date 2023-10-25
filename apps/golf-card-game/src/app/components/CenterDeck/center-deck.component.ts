import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardService } from '../../game-board.service';
import { UserService } from '../../user.service';
import { RoomService } from '../../room.service';
import { ClientSocketAction, SocketPayload } from '@golf-card-game/interfaces';

@Component({
  selector: 'golf-card-game-center-deck',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './center-deck.component.html',
  styleUrls: ['./center-deck.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterDeckComponent {

  currentPlayerTurnName = computed(() => {
    const currentPlayerTurnId = this.gameBoardService.currentTurnPlayerId();
    if (this.userService.userId() === currentPlayerTurnId) {
      return this.userService.PLAYER_NAME;
    } else {
      return this.roomService.getPlayerName(currentPlayerTurnId);
    }
  });

  constructor(
    public gameBoardService: GameBoardService,
    public userService: UserService,
    public roomService: RoomService,
  ) {}

  drawNewCard() {
    const drawNewCardPayload: SocketPayload = {
      action: ClientSocketAction.DrawNewCard,
      room: this.roomService.ROOM_NAME,
      playerId: this.userService.userId(),
    }

    this.userService.websocketSubject.next(drawNewCardPayload);
    this.gameBoardService.setHasDrawnNewCard(true);
  }
}
