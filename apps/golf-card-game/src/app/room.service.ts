import { Injectable, Signal, computed, signal } from '@angular/core';

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
  }

  removePlayer(idToRemove: string) {
    this._otherPlayers.update((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== idToRemove)
    );
  }
}
