import { Injectable, signal } from '@angular/core';
import {
  CardGridView,
  GameBoard,
} from '@golf-card-game/interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameBoardService {
  private GAMEBOARD: GameBoard = {
    players: {},
  };
  private _gameBoard = signal<GameBoard>(this.GAMEBOARD);
  gameBoard = this._gameBoard.asReadonly();

  constructor() {}

  setPlayerHand(
    playerId: string,
    hand: {
      playerName: string;
      cardGrid: CardGridView;
    }
  ) {
    this._gameBoard.mutate((value: GameBoard) => {
      value.players[playerId] = hand;
    });

    console.log(this._gameBoard())
  }

  reset() {
    this._gameBoard.set(this.GAMEBOARD);
  }
}
