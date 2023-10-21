import {
  Rooms,
  ClientSocketAction,
  SocketPayload,
  CardGrid,
  Deck,
  SetDrawnCardPayload,
  ServerSocketAction,
  SetPlayerTurnPayload,
  Room,
  RevealCardPayload,
} from '@golf-card-game/interfaces';
import { WebSocket } from 'ws';
import { handleStartGame } from './game-start-handler';
import { handleRevealCard } from './reveal-card-handler';

// This function is the main place where room is modified
function handleGameRuntime(socket: WebSocket, roomDatabase: Rooms) {
  socket.on('message', (data: string) => {
    try {
      const parsedData = JSON.parse(data) as SocketPayload;

      const action = parsedData.action,
        roomName = parsedData.room;

      if (action === ClientSocketAction.StartGame) {
        handleStartGame(roomDatabase, roomName);
      } else if (action === ClientSocketAction.RevealCard) {
        handleRevealCard({
          roomDatabase,
          roomName,
          playerId: parsedData.playerId,
          cardPosition: (parsedData as RevealCardPayload).cardPosition
        });

        //TODO: call logic to handle end of the game if this is the last player turn in the last round
        //TODO: handle frontend logic for reveal card and set last round
      }
    } catch (e) {
      console.error(e);
    }
  });
}

export { handleGameRuntime };
