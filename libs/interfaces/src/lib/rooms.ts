import { WebSocket } from 'ws';
import { CardGrid } from './card-grid';
import { CardInADeck } from './card';


export type Room = {
  gameAuditTrail: Record<string, string>[];
  players: {
    [socketUuid in string]: PlayerProfile;
  };
  leftOverCards: CardInADeck[];
  drawnCard: CardInADeck | null;
  currentTurnPlayerId: string;
  lastRoundTriggeredByPlayerId: string | null;
  status: RoomStatus;
}

export type Rooms = {
  [room in string]: Room;
};

export type PlayerProfile = {
  playerName: string;
  socket: WebSocket;
  cards: CardGrid;
};

export enum RoomStatus {
  Waiting,
  Ready,
  InGame,
  LastRound,
  Ended
}