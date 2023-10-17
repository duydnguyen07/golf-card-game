import { PlayerProfile, Rooms } from '@golf-card-game/interfaces';

function sendMessageToOtherPlayersInRoom(
  rooms: Rooms,
  room: string,
  sourceUuid: string,
  passThroughMessage: string
) {
  Object.entries(rooms[room].players).forEach(
    ([uuid, playerProfile]: [string, PlayerProfile]) => {
      // Prevent sending to self
      if (uuid !== sourceUuid) {
        playerProfile.socket.send(passThroughMessage);
      }
    }
  );
}

function broadcastMessageToAllPlayersInRoom(
  rooms: Rooms,
  room: string,
  passThroughMessage: string
) {
  Object.entries(rooms[room].players).forEach(
    ([_, playerProfile]: [string, PlayerProfile]) => {
      playerProfile.socket.send(passThroughMessage);
    }
  );
}

export { sendMessageToOtherPlayersInRoom, broadcastMessageToAllPlayersInRoom };
