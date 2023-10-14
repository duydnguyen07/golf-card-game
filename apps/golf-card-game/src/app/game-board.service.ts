import { Injectable, Signal, computed, signal } from '@angular/core';
import { GameBoard, SocketPayload } from '@golf-card-game/interfaces';
import { CardGridView } from 'libs/interfaces/src/lib/card-grid';

@Injectable({
  providedIn: 'root',
})
export class GameBoardService {
  private GAMEBOARD: GameBoard = {
    players: {},
  };
  gameBoard = signal<GameBoard>(this.GAMEBOARD);

  constructor() {}

  setPlayerHand(
    playerId: string,
    hand: {
      playerName: string;
      cardGrid: CardGridView;
    }
  ) {
    this.gameBoard.mutate((value: GameBoard) => {
      value.players[playerId] = hand;
    });
  }

  reset() {
    this.gameBoard.set(this.GAMEBOARD);
  }
}
