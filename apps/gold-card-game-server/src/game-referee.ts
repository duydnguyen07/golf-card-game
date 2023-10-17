import {
  Rooms,
  ClientSocketAction,
  SocketPayload,
  CardGrid,
  Deck,
} from '@golf-card-game/interfaces';
import { WebSocket } from 'ws';
import { notifyAllPlayersAboutDealtCards, deal9Cards } from './card-dealer';
import { drawACard } from './game-logic-engine';

// This function is the main place where room is modified
function handleGameRuntime(socket: WebSocket, roomDatabase: Rooms) {
  socket.on('message', (data: string) => {
    try {
      const parsedData = JSON.parse(data) as SocketPayload;

      const action = parsedData.action,
        room = parsedData.room;

      if (action === ClientSocketAction.StartGame) {
        const playersInRoom = Object.entries(roomDatabase[room].players);

        const dealtCardsAndDeck: {
          dealtCardsPerPlayer: {
            [key in number]: CardGrid;
          };
          leftOver: Partial<Deck>[];
        } = deal9Cards(3, playersInRoom.length);
      
        playersInRoom.forEach(([_, playerProfile], index) => {
          playerProfile.cards = dealtCardsAndDeck.dealtCardsPerPlayer[index];
        });


        notifyAllPlayersAboutDealtCards(playersInRoom, room);
        const nextCardRecord = drawACard(roomDatabase, room);
        console.log(nextCardRecord)

      }
    } catch (e) {
      console.error(e);
    }
  });
}

export { handleGameRuntime };
