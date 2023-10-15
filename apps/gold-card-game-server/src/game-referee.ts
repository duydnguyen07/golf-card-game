import {
  Rooms,
  SocketAction,
  SocketPayload,
} from '@golf-card-game/interfaces';
import { WebSocket } from 'ws';
import { dealCardAndNotifyAllPlayers } from './card-dealer';

function handleGameRuntime(socket: WebSocket, roomDatabase: Rooms) {
  socket.on('message', (data: string) => {
    try {
      const parsedData = JSON.parse(data) as SocketPayload;

      const action = parsedData.action,
        room = parsedData.room;

      if (action === SocketAction.StartGame) {
        dealCardAndNotifyAllPlayers(roomDatabase, room);
      }
    } catch (e) {
      console.error(e);
    }
  });
}



export { handleGameRuntime };
