import { Injectable, Signal, computed, signal } from '@angular/core';
import { SocketPayload } from '@golf-card-game/interfaces';
import { BehaviorSubject, map } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userId = signal<string>('');

  readonly userId = this._userId.asReadonly();
  readonly isJoiningRoom$ = computed(() => !this._userId());
  readonly websocketSubject = webSocket<SocketPayload>('ws://localhost:3333/ws'); //TODO: handle this, we cannot let it be any value

  constructor() { }

  setUserId(userId: string ) {
    this._userId.set(userId);
  }
}
