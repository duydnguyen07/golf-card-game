import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import {
  CardGridView,
  CardInADeck,
  CardPosition,
  GameBoard,
} from '@golf-card-game/interfaces';
import { cloneDeep } from 'lodash';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class GameBoardService {
  private GAMEBOARD: GameBoard = {
    players: {},
  };
  private _gameBoard = signal<GameBoard>(this.GAMEBOARD);
  private _currentDrawnCard = signal<CardInADeck | null>(null);
  private _currentTurnPlayerId = signal<string>('');
  private _isLastRound = signal(false);
  private _isGameOver = signal(false);
  private _winnerName = signal('');
  private _winnerId = signal('');
  private _hasDrawnNewCard: WritableSignal<boolean | null> = signal(false);

  readonly gameBoard = this._gameBoard.asReadonly();
  readonly currentDrawnCard = this._currentDrawnCard.asReadonly();
  readonly currentTurnPlayerId = this._currentTurnPlayerId.asReadonly();
  readonly isLastRound = this._isLastRound.asReadonly();
  readonly isGameOver = this._isGameOver.asReadonly();
  readonly winnerId = this._winnerId.asReadonly();
  readonly winnerName = this._winnerName.asReadonly();
  readonly hasDrawnNewCard = this._hasDrawnNewCard.asReadonly();

  readonly isMyTurn = computed(() => {
    const currentPlayerTurnId = this.currentTurnPlayerId();
    return this.isCurrentPlayerMe(currentPlayerTurnId);
  });

  constructor(private userService: UserService) {
    effect(() => {});
  }

  setHasDrawnNewCard(value: boolean | null) {
    this._hasDrawnNewCard.set(value);
  }

  setWinnerId(value: string) {
    this._winnerId.set(value);
  }

  setWinnerName(value: string) {
    this._winnerName.set(value);
  }

  setGameOver(value: boolean) {
    this._isGameOver.set(value);
  }

  setLastRound(value: boolean) {
    this._isLastRound.set(value);
  }

  setCurrentTurnPlayerId(id: string) {
    this._currentTurnPlayerId.set(id);

    if (this.isCurrentPlayerMe(id)) {
      this.setHasDrawnNewCard(false);
    } else {
      this.setHasDrawnNewCard(null);
    }
  }

  setDrawnCard(card: CardInADeck) {
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
  }

  setRevealedCard(
    playerId: string,
    cardName: CardInADeck,
    cardPosition: CardPosition
  ) {
    this._gameBoard.mutate((value: GameBoard) => {
      const clonedPlayerHand = cloneDeep(value.players[playerId]);

      const playerCardGrid = clonedPlayerHand.cardGrid;
      const newCardRecord: {
        isRevealed: boolean;
        name: CardInADeck;
      } = {
        isRevealed: true,
        name: cardName,
      };
      if (cardPosition.columnIndex === 0) {
        playerCardGrid.col1[cardPosition.cardPositionIndex] = newCardRecord;
      } else if (cardPosition.columnIndex === 1) {
        playerCardGrid.col2[cardPosition.cardPositionIndex] = newCardRecord;
      } else if (cardPosition.columnIndex === 2) {
        playerCardGrid.col3[cardPosition.cardPositionIndex] = newCardRecord;
      }

      value.players[playerId] = clonedPlayerHand;
    });
  }

  reset() {
    this._gameBoard.set(this.GAMEBOARD);
  }

  private isCurrentPlayerMe(currentPlayerTurnId: string) {
    return this.userService.userId() === currentPlayerTurnId;
  }
}
