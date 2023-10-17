import { CardGridView } from "./card-grid";

export interface SocketPayload {
  passThroughMessage: string | null;
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
  cardGrid: CardGridView
}

export interface SetPlayerTurn extends SocketPayload {
  action: ServerSocketAction.SetPlayerTurn;
}

export interface SetDrawnCard extends SocketPayload {
  action: ServerSocketAction.SetDrawnCard;
}

export enum ClientSocketAction {
  Join = 'join',
  Leave = 'leave',
  PassThrough = 'pass_through',
  StartGame = 'start_game',
}

export enum ServerSocketAction {
  SetPlayerHand = 'set_player_hand',
  SetPlayerTurn = 'set_player_turn',
  SetDrawnCard = 'set_drawn_card',
  JoinedSuccess = 'joined_success',
  NewPlayerJoinedSuccess = 'new_player_joined_success',
  ExistingPlayerLeft = 'existing_player_left',
}
