import {
  Room,
  Rooms,
  ServerSocketAction,
  SetPlayerTurnPayload,
} from '@golf-card-game/interfaces';
import { getNextPlayerId } from './game-logic-engine';
import { broadcastMessageToAllPlayersInRoom } from './socket-util';

function getNextPlayerIdAndUpdatePlayersAndRoom({
  roomName,
  roomDatabase,
}: {
  roomName: string;
  roomDatabase: Rooms;
}) {
  const currentRoom: Room = roomDatabase[roomName];

  const nextTurnsPlayerId = getNextPlayerId(currentRoom);

  currentRoom.currentTurnPlayerId = nextTurnsPlayerId;

  const setPlayerTurnPayload: SetPlayerTurnPayload = {
    action: ServerSocketAction.SetPlayerTurn,
    room: roomName,
    playerId: nextTurnsPlayerId,
  };

  broadcastMessageToAllPlayersInRoom(
    roomDatabase,
    roomName,
    JSON.stringify(setPlayerTurnPayload)
  );
}

export { getNextPlayerIdAndUpdatePlayersAndRoom };
