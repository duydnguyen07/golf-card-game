import { WebSocket } from 'ws';
import { Deck } from './deck';
import { CardGrid } from './card-grid';


export type Room = {
  gameAuditTrail: Record<string, string>[];
  players: {
    [socketUuid in string]: PlayerProfile;
  };
  leftOverCards: Partial<Deck>[];
  drawnCard: Partial<Deck> | null;
  status: RoomStatus;
  currentTurnPlayerId: string;
  lastRoundTriggeredByPlayerId: string | null;
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