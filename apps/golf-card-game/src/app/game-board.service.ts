import { Injectable, signal } from '@angular/core';
import {
  CardGridView,
  Deck,
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
  private _currentDrawnCard = signal<Partial<Deck> | null>(null);
  private _currentTurnPlayerId = signal<string>('');

  readonly gameBoard = this._gameBoard.asReadonly();
  readonly currentDrawnCard = this._currentDrawnCard.asReadonly();
  readonly currentTurnPlayerId = this._currentTurnPlayerId.asReadonly();
  constructor() {}

  setCurrentTurnPlayerId(id: string) {
    this._currentTurnPlayerId.set(id);
  }

  setDrawnCard(card: Partial<Deck>) {
    this._currentDrawnCard.set(card);
  }

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
