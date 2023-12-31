import {
  Rooms,
  ClientSocketAction,
  SocketPayload,
  RevealCardPayload,
  SwapCardPayload,
} from '@golf-card-game/interfaces';
import { WebSocket } from 'ws';
import { drawCardAndUpdatePlayersAndRoom, handleStartGame } from './game-start-handler';
import { handleRevealCard } from './reveal-card-handler';
import { handleGameEnd, isGameOver } from './end-game-handler';
import { getNextPlayerIdAndUpdatePlayersAndRoom } from './next-player-handler';
import { revealAllCards } from './reveal-all-cards-handler';
import { handleSwapCard } from './swap-card-handler';

// This function is the main place where room is modified
function handleGameRuntime(socket: WebSocket, roomDatabase: Rooms) {
  socket.on('message', (data: string) => {
    try {
      const parsedData = JSON.parse(data) as SocketPayload;

      const action = parsedData.action,
        roomName = parsedData.room;

      if (action === ClientSocketAction.StartGame) {
        handleStartGame(roomDatabase, roomName);

        getNextPlayerIdAndUpdatePlayersAndRoom({
          roomName,
          roomDatabase,
        });
      } else if (
        action === ClientSocketAction.RevealCard ||
        action === ClientSocketAction.RevealAllCards
      ) {
        if (action === ClientSocketAction.RevealCard) {
          handleRevealCard({
            roomDatabase,
            roomName,
            playerId: parsedData.playerId,
            cardPosition: (parsedData as RevealCardPayload).cardPosition,
          });
        } else {
          revealAllCards(roomName, roomDatabase, parsedData.playerId);
        }

        if (isGameOver(roomDatabase[roomName])) {
          handleGameEnd({
            roomDatabase,
            roomName,
          });
        } else {
          getNextPlayerIdAndUpdatePlayersAndRoom({
            roomName,
            roomDatabase,
          });
        }
      } else if (
        action === ClientSocketAction.DrawNewCard
      ) {
        const currentRoom = roomDatabase[roomName]

        drawCardAndUpdatePlayersAndRoom({
          leftOverCards: currentRoom.leftOverCards,
          roomName,
          roomDatabase,
        })
      } else if(
        action === ClientSocketAction.SwapCard
      ) {
        handleSwapCard({
          roomDatabase,
          roomName,
          playerId: parsedData.playerId,
          cardPosition: (parsedData as SwapCardPayload).cardPosition,
        });

        handleRevealCard({
          roomDatabase,
          roomName,
          playerId: parsedData.playerId,
          cardPosition: (parsedData as SwapCardPayload).cardPosition,
        });

        const isLastRound = roomDatabase[roomName].lastRoundTriggeredByPlayerId;

        if(isLastRound) {
          revealAllCards(roomName, roomDatabase, parsedData.playerId);
        } 

        if (isGameOver(roomDatabase[roomName])) {
          handleGameEnd({
            roomDatabase,
            roomName,
          });
        } else {
          getNextPlayerIdAndUpdatePlayersAndRoom({
            roomName,
            roomDatabase,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
}

export { handleGameRuntime };
