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
} from '@golf-card-game/interfaces';
import { WebSocket } from 'ws';
import { notifyAllPlayersAboutDealtCards, deal9Cards } from './card-dealer';
import { drawACard, getNextPlayerId } from './game-logic-engine';
import { broadcastMessageToAllPlayersInRoom } from './socket-util';

// This function is the main place where room is modified
function handleGameRuntime(socket: WebSocket, roomDatabase: Rooms) {
  socket.on('message', (data: string) => {
    try {
      const parsedData = JSON.parse(data) as SocketPayload;

      const action = parsedData.action,
        roomName = parsedData.room;

      if (action === ClientSocketAction.StartGame) {
        handleStartGame(roomDatabase, roomName);
      }
    } catch (e) {
      console.error(e);
    }
  });
}

function handleStartGame(roomDatabase: Rooms, roomName: string) {
  const currentRoom = roomDatabase[roomName];
  const playersInRoom = Object.entries(currentRoom.players);

  const dealtCardsAndDeck: {
    dealtCardsPerPlayer: {
      [key in number]: CardGrid;
    };
    leftOver: Partial<Deck>[];
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

  getNextPlayerIdAndUpdatePlayersAndRoom({
    currentRoom,
    roomName,
    roomDatabase,
  })
}

function getNextPlayerIdAndUpdatePlayersAndRoom({
  currentRoom,
  roomName,
  roomDatabase,
}: {
  currentRoom: Room;
  roomName: string;
  roomDatabase: Rooms;
}) {

  const nextTurnsPlayerId = getNextPlayerId(currentRoom);

  currentRoom.currentTurnPlayerId = nextTurnsPlayerId;

  const setPlayerTurnPayload: SetPlayerTurnPayload = {
    action: ServerSocketAction.SetPlayerTurn,
    passThroughMessage: null,
    room: roomName,
    playerId: nextTurnsPlayerId,
  };

  broadcastMessageToAllPlayersInRoom(
    roomDatabase,
    roomName,
    JSON.stringify(setPlayerTurnPayload)
  );
}

function drawCardAndUpdatePlayersAndRoom({
  currentRoom,
  leftOverCards,
  roomName,
  roomDatabase,
}: {
  currentRoom: Room;
  leftOverCards: Partial<Deck>[];
  roomName: string;
  roomDatabase: Rooms;
}) {
  const nextCardRecord = drawACard(leftOverCards);
  currentRoom.drawnCard = nextCardRecord.drawnCard;
  currentRoom.leftOverCards = nextCardRecord.leftOverCards;

  const setDrawnCardPayload: SetDrawnCardPayload = {
    action: ServerSocketAction.SetDrawnCard,
    passThroughMessage: '',
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

export { handleGameRuntime };
