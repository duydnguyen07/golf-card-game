import { WebSocket } from 'ws';

export type Rooms = {
  [room in string]: {
    [socketUuid in string]: PlayerProfile;
  };
};

export type PlayerProfile = {
  playerName: string;
  socket: WebSocket;
};
