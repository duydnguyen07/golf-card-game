import { WebSocket } from 'ws';
import { Deck } from './deck';

export type Rooms = {
  [room in string]: {
    gameAuditTrail: [];
    players: {
      [socketUuid in string]: PlayerProfile;
    };
  };
};

export type PlayerProfile = {
  playerName: string;
  socket: WebSocket;
  cards: Partial<Deck>[];
};
