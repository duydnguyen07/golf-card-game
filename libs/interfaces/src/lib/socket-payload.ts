export interface SocketPayload {
  passThroughMessage: string | null;
  action: SocketAction;
  room: string;
  playerId: string;
}

export interface SocketJoinPayload extends SocketPayload {
  playerName: string;
  action: SocketAction.Join;
}

export interface NewPlayerJoinedSuccessPayload extends SocketPayload {
  playerName: string;
  action: SocketAction.NewPlayerJoinedSuccess;
}

export interface ExistingPlayerLeftPayload extends SocketPayload {
  action: SocketAction.ExistingPlayerLeft;
}

export interface JoinedSuccessPayload extends SocketPayload {}

export enum SocketAction {
  Join = 'join',
  Leave = 'leave',
  PassThrough = 'pass_through',
  JoinedSuccess = 'joined_success',
  NewPlayerJoinedSuccess = 'new_player_joined_success',
  ExistingPlayerLeft = 'existing_player_left',
}
