export interface SocketPayload {
  passThroughMessage: string | null;
  action: SocketAction;
  room: string;
  playerId: string,
}

export interface SocketJoinPayload extends SocketPayload {
  playerName: string
  action: SocketAction.Join;
}

export enum SocketAction {
  Join = 'join',
  Leave = 'leave',
  PassThrough = 'pass_through'
}