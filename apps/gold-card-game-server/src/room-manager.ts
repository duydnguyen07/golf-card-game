import {
  PlayerProfile,
  Rooms,
  SocketAction,
  SocketJoinPayload,
  SocketPayload,
} from '@golf-card-game/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';

const rooms: Rooms = {};

function handleRoomSetup(socket: WebSocket) {
  const uuid = uuidv4();

  const leave = (room: string) => {
    // not present: do nothing
    if (!rooms[room][uuid]) return;

    // if the one exiting is the last one, destroy the room
    if (Object.keys(rooms[room]).length === 1) delete rooms[room];
    // otherwise simply leave the room
    else delete rooms[room][uuid];
  };

  socket.on('message', (data: string) => {
    try {
      const parsedData = JSON.parse(data) as SocketPayload;

      const passThroughMessage = parsedData.passThroughMessage,
        action = parsedData.action,
        room = parsedData.room,
        playerId = parsedData.playerId;

      if (action === SocketAction.Join) {
        const playerName = (parsedData as SocketJoinPayload).playerName;
        handleJoinAction(rooms, room, uuid, socket, playerName);
      } else if (action === SocketAction.Leave) {
        leave(room);
      } else if (action === SocketAction.PassThrough) {
        if (rooms[room]) {
          sendMessageToPeopleInRoom(rooms, room, playerId, passThroughMessage);
        } else {
          console.warn('Warning: Unknown room for the following data', data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('close', () => {
    // for each room, remove the closed socket
    Object.keys(rooms).forEach((room) => leave(room));
  });
}

function handleJoinAction(
  rooms: Rooms,
  room: string,
  uuid: string,
  socket: WebSocket,
  playerName: string
) {
  if (!rooms[room]) {
    rooms[room] = {}; // create the room
  }
  if (!rooms[room][uuid]) {
    rooms[room][uuid] = {
      playerName,
      socket,
    }; // join the room

    sendMessageToPeopleInRoom(
      rooms,
      room,
      uuid,
      JSON.stringify({ playerName })
    );
  }
}

function sendMessageToPeopleInRoom(
  rooms: Rooms,
  room: string,
  sourceUuid: string,
  passThroughMessage: string
) {
  Object.entries(rooms[room]).forEach(
    ([uuid, playerProfile]: [string, PlayerProfile]) => {
      // Prevent sending to self
      if (uuid !== sourceUuid) {
        playerProfile.socket.send(passThroughMessage);
      }
    }
  );
}

export { handleRoomSetup };
