import { WebSocket } from 'ws';
import { Deck } from './deck';
import { CardGrid } from './card-grid';

export type Rooms = {
  [room in string]: {
    gameAuditTrail: [];
    players: {
      [socketUuid in string]: PlayerProfile;
    };
    leftOverCards: Partial<Deck>[];
    status: RoomStatus
  };
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