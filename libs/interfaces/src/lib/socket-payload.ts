import { CardGridView, CardPosition } from './card-grid';
import { Deck } from './deck';

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
  drawnCard: Partial<Deck>;
}

export interface RevealCardPayload extends SocketPayload {
  action: ClientSocketAction.RevealCard;
  cardPosition: CardPosition;
}

export interface SetRevealedCardPayload extends SocketPayload {
  action: ServerSocketAction.SetRevealedCard;
  revealedCard: Partial<Deck>;
} 

export interface NotifyErrorPayload extends SocketPayload { 
  action: ServerSocketAction.Error;
  errorMessage: string;
}

export interface SetLastRoundPayload extends SocketPayload { 
  action: ServerSocketAction.SetLastRound;
}

export enum ClientSocketAction {
  Join = 'join',
  Leave = 'leave',
  StartGame = 'start_game',
  RevealCard = 'reveal_card',
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
  Error = "error"
}
