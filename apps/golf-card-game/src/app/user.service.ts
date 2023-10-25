import { Injectable, computed, signal } from '@angular/core';
import { SocketPayload } from '@golf-card-game/interfaces';
import { webSocket } from 'rxjs/webSocket';
import { GameBoardService } from './game-board.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _userId = signal<string>('');

  readonly userId = this._userId.asReadonly();
  readonly isJoiningRoom$ = computed(() => !this._userId());
  readonly websocketSubject = webSocket<SocketPayload>(
    'ws://localhost:3333/ws'
  ); //TODO: handle this, we cannot let it be any value

  readonly PLAYER_NAME = Math.random() + '';

  readonly isMyTurn = computed(() => {
    const currentPlayerTurnId = this.gameBoardService.currentTurnPlayerId();
    return this.userId() === currentPlayerTurnId;
  });

  constructor(public gameBoardService: GameBoardService) {}

  setUserId(userId: string) {
    this._userId.set(userId);
  }
}
