import {
  ExistingPlayerLeftPayload,
  NewPlayerJoinedSuccessPayload,
  RoomStatus,
  Rooms,
  ClientSocketAction,
  SocketJoinPayload,
  SocketPayload,
  generateCardGrid,
  ServerSocketAction,
} from '@golf-card-game/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';
import { sendMessageToOtherPlayersInRoom } from './socket-util';

const ROOM_DATABASE: Rooms = {};

function handleRoomSetup(socket: WebSocket) {
  const uuid = uuidv4();

  const leave = (room: string) => {
    // not present: do nothing
    if (!ROOM_DATABASE[room].players[uuid]) return;

    // if the one exiting is the last one, destroy the room
    if (Object.keys(ROOM_DATABASE[room].players).length === 1)
      delete ROOM_DATABASE[room];
    // otherwise simply leave the room
    else {
      delete ROOM_DATABASE[room].players[uuid];
      const userLeftPayload: ExistingPlayerLeftPayload = {
        passThroughMessage: null,
        action: ServerSocketAction.ExistingPlayerLeft,
        room: room,
        playerId: uuid,
      };
      sendMessageToOtherPlayersInRoom(
        ROOM_DATABASE,
        room,
        uuid,
        JSON.stringify(userLeftPayload)
      );
    }
  };

  socket.on('message', (data: string) => {
    try {
      const parsedData = JSON.parse(data) as SocketPayload;

      const passThroughMessage = parsedData.passThroughMessage,
        action = parsedData.action,
        room = parsedData.room,
        playerId = parsedData.playerId;

      if (action === ClientSocketAction.Join) {
        const playerName = (parsedData as SocketJoinPayload).playerName;
        handleJoinAction(ROOM_DATABASE, room, uuid, socket, playerName);

        console.log('rooms', ROOM_DATABASE);
      } else if (action === ClientSocketAction.Leave) {
        leave(room);
      } else if (action === ClientSocketAction.PassThrough) {
        if (ROOM_DATABASE[room]) {
          sendMessageToOtherPlayersInRoom(
            ROOM_DATABASE,
            room,
            playerId,
            passThroughMessage
          );
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
    Object.keys(ROOM_DATABASE).forEach((room) => leave(room));
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
    rooms[room] = {
      players: {},
      gameAuditTrail: [],
      leftOverCards: [],
      status: RoomStatus.Waiting,
      drawnCard: null,
      currentTurnPlayerId: '',
      lastPlayerTurnId: ''
    }; // create the room
  }
  if (!rooms[room].players[uuid]) {
    rooms[room].players[uuid] = {
      playerName,
      socket,
      cards: generateCardGrid() ,
    }; // join the room

    notifyUserAboutRoomJoinSuccess(rooms, room, uuid, socket);
    notifyExistingPlayersAboutNewPlayer(rooms, room, uuid, playerName);
  }
}

function notifyExistingPlayersAboutNewPlayer(
  rooms: Rooms,
  room: string,
  uuid: string,
  playerName: string
) {
  const newPlayerJoinedSuccessPayload: NewPlayerJoinedSuccessPayload = {
    passThroughMessage: null,
    action: ServerSocketAction.NewPlayerJoinedSuccess,
    room: room,
    playerId: uuid,
    playerName: playerName,
  };
  sendMessageToOtherPlayersInRoom(
    rooms,
    room,
    uuid,
    JSON.stringify(newPlayerJoinedSuccessPayload)
  );
}

function notifyUserAboutRoomJoinSuccess(
  rooms: Rooms,
  room: string,
  uuid: string,
  socket: WebSocket
) {
  // Notify current user of successful room
  const joinedSuccessfulPayload: SocketPayload = {
    passThroughMessage: null,
    action: ServerSocketAction.JoinedSuccess,
    room: room,
    playerId: uuid,
  };
  socket.send(JSON.stringify(joinedSuccessfulPayload));

  // Notify current user about existing players
  Object.keys(rooms[room].players).forEach((existingPlayerId: string) => {
    const existingPlayer = rooms[room].players[existingPlayerId];
    if (existingPlayerId !== uuid) {
      const existingPlayerPayload: NewPlayerJoinedSuccessPayload = {
        passThroughMessage: null,
        action: ServerSocketAction.NewPlayerJoinedSuccess,
        room: room,
        playerId: existingPlayerId,
        playerName: existingPlayer.playerName,
      };
      socket.send(JSON.stringify(existingPlayerPayload));
    }
  });
}



export { handleRoomSetup, ROOM_DATABASE };
