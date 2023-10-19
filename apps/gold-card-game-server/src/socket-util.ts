import { PlayerProfile, Room, Rooms } from '@golf-card-game/interfaces';

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
        logAuditTrail(rooms[room], {
          [playerProfile.playerName]: passThroughMessage
        })
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
      logAuditTrail(rooms[room], {
        [playerProfile.playerName]: passThroughMessage
      })
    }
  );
}

function logAuditTrail(currentRoom: Room, record: Record<string, string>) {
  currentRoom.gameAuditTrail.push(record)
}

export { sendMessageToOtherPlayersInRoom, broadcastMessageToAllPlayersInRoom, logAuditTrail };
