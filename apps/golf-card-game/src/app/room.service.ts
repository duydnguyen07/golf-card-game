import { Injectable, Signal, computed, signal } from '@angular/core';
import { SocketPayload } from '@golf-card-game/interfaces';
import { BehaviorSubject, map } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly _otherPlayers = signal<{ name: string; id: string }[]>([]);

  get otherPlayers() {
    return this._otherPlayers.asReadonly();
  }

  constructor() {}

  addPlayer(name: string, id: string) {
    this._otherPlayers.update((currentPlayers) => [
      ...currentPlayers,
      { name, id },
    ]);

    console.log(this._otherPlayers())
  }

  removePlayer(idToRemove: string) {
    this._otherPlayers.update((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== idToRemove)
    );
  }
}
