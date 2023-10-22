import { CardInADeck } from './card';
import { CardGridView, CardPosition, Score } from './card-grid';

export interface SocketPayload {
  action: ClientSocketAction | ServerSocketAction;
  room: string;
  playerId: string;
}

export interface SocketJoinPayload extends SocketPayload {
  playerName: string;
  action: ClientSocketAction.Join;
}

export interface NewPlayerJoinedSuccessPayload extends SocketPayload {
  playerName: string;
  action: ServerSocketAction.NewPlayerJoinedSuccess;
}

export interface ExistingPlayerLeftPayload extends SocketPayload {
  action: ServerSocketAction.ExistingPlayerLeft;
}

export interface SetPlayerHandPayload extends SocketPayload {
  action: ServerSocketAction.SetPlayerHand;
  playerName: string;
  cardGrid: CardGridView;
}

export interface SetPlayerTurnPayload extends SocketPayload {
  action: ServerSocketAction.SetPlayerTurn;
}

export interface SetDrawnCardPayload extends SocketPayload {
  action: ServerSocketAction.SetDrawnCard;
  drawnCard: CardInADeck;
}

export interface RevealCardPayload extends SocketPayload {
  action: ClientSocketAction.RevealCard;
  cardPosition: CardPosition;
}

export interface SetRevealedCardPayload extends SocketPayload {
  action: ServerSocketAction.SetRevealedCard;
  revealedCard: CardInADeck;
  cardPosition: CardPosition;
} 

export interface NotifyErrorPayload extends SocketPayload { 
  action: ServerSocketAction.Error;
  errorMessage: string;
}

export interface SetLastRoundPayload extends SocketPayload { 
  action: ServerSocketAction.SetLastRound;
}

export interface GameEndedPayload extends SocketPayload { 
  action: ServerSocketAction.GameEnded;
  playerScores: Score[];
  playerName: string;
}

export enum ClientSocketAction {
  Join = 'join',
  Leave = 'leave',
  StartGame = 'start_game',
  RevealCard = 'reveal_card',
  RevealAllCards = 'reveal_all_cards'
}

export enum ServerSocketAction {
  SetPlayerHand = 'set_player_hand',
  SetPlayerTurn = 'set_player_turn',
  SetDrawnCard = 'set_drawn_card',
  SetRevealedCard = 'set_revealed_card',
  SetLastRound = 'set_last_round',
  JoinedSuccess = 'joined_success',
  NewPlayerJoinedSuccess = 'new_player_joined_success',
  ExistingPlayerLeft = 'existing_player_left',
  GameEnded = 'game_ended',
  Error = "error"
}
