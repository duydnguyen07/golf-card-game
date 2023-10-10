import { Injectable, Signal, computed, signal } from '@angular/core';
import { SocketPayload } from '@golf-card-game/interfaces';
import { BehaviorSubject, map } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userId = new BehaviorSubject('');

  readonly userId$ = this._userId.asObservable();
  readonly isJoiningRoom$ = this.userId$.pipe(map((userId) => !userId))
  readonly websocketSubject = webSocket<SocketPayload>('ws://localhost:3333/ws'); //TODO: handle this, we cannot let it be any value

  constructor() { }

  setUserId(userId: string ) {
    this._userId.next(userId);
  }
}
