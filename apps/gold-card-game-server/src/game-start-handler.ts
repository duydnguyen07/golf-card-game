import {
  CardGrid,
  CardInADeck,
  Room,
  Rooms,
  ServerSocketAction,
  SetDrawnCardPayload,
  SetPlayerTurnPayload,
} from '@golf-card-game/interfaces';
import { drawACard, getNextPlayerId } from './game-logic-engine';
import { broadcastMessageToAllPlayersInRoom } from './socket-util';
import { deal9Cards, notifyAllPlayersAboutDealtCards } from './card-dealer';

function handleStartGame(roomDatabase: Rooms, roomName: string) {
  const currentRoom = roomDatabase[roomName];
  const playersInRoom = Object.entries(currentRoom.players);

  const dealtCardsAndDeck: {
    dealtCardsPerPlayer: {
      [key in number]: CardGrid;
    };
    leftOver: CardInADeck[];
  } = deal9Cards(3, playersInRoom.length);

  // Set cards to room
  playersInRoom.forEach(([_, playerProfile], index) => {
    playerProfile.cards = dealtCardsAndDeck.dealtCardsPerPlayer[index];
  });

  // Notify players
  notifyAllPlayersAboutDealtCards(playersInRoom, roomName, currentRoom);

  drawCardAndUpdatePlayersAndRoom({
    currentRoom,
    leftOverCards: dealtCardsAndDeck.leftOver,
    roomName,
    roomDatabase,
  });
}


function drawCardAndUpdatePlayersAndRoom({
  currentRoom,
  leftOverCards,
  roomName,
  roomDatabase,
}: {
  currentRoom: Room;
  leftOverCards: CardInADeck[];
  roomName: string;
  roomDatabase: Rooms;
}) {
  const nextCardRecord = drawACard(leftOverCards);
  currentRoom.drawnCard = nextCardRecord.drawnCard;
  currentRoom.leftOverCards = nextCardRecord.leftOverCards;

  const setDrawnCardPayload: SetDrawnCardPayload = {
    action: ServerSocketAction.SetDrawnCard,
    room: roomName,
    playerId: '',
    drawnCard: currentRoom.drawnCard,
  };

  broadcastMessageToAllPlayersInRoom(
    roomDatabase,
    roomName,
    JSON.stringify(setDrawnCardPayload)
  );
}

export { handleStartGame };
