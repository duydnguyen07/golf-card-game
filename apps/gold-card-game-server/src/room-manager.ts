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
import { logAuditTrail, sendMessageToOtherPlayersInRoom } from './socket-util';

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

      const action = parsedData.action,
        room = parsedData.room;

      if (action === ClientSocketAction.Join) {
        const playerName = (parsedData as SocketJoinPayload).playerName;
        handleJoinAction(ROOM_DATABASE, room, uuid, socket, playerName);
      } else if (action === ClientSocketAction.Leave) {
        leave(room);
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
      lastRoundTriggeredByPlayerId: null
    }; // create the room
  }
  if (!rooms[room].players[uuid]) {
    rooms[room].players[uuid] = {
      playerName,
      socket,
      cards: generateCardGrid() ,
    }; // join the room

    notifyUserAboutRoomJoinSuccess(rooms, room, uuid, socket, playerName);
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
  socket: WebSocket,
  playerName: string
) {
  // Notify current user of successful room
  const joinedSuccessfulPayload: SocketPayload = {
    action: ServerSocketAction.JoinedSuccess,
    room: room,
    playerId: uuid,
  };
  const passThroughMessage = JSON.stringify(joinedSuccessfulPayload)
  socket.send(passThroughMessage);
  logAuditTrail(rooms[room], {[playerName]: passThroughMessage})

  // Notify current user about existing players
  Object.keys(rooms[room].players).forEach((existingPlayerId: string) => {
    const existingPlayer = rooms[room].players[existingPlayerId];
    if (existingPlayerId !== uuid) {
      const existingPlayerPayload: NewPlayerJoinedSuccessPayload = {
        action: ServerSocketAction.NewPlayerJoinedSuccess,
        room: room,
        playerId: existingPlayerId,
        playerName: existingPlayer.playerName,
      };
      socket.send(JSON.stringify(existingPlayerPayload));
      logAuditTrail(rooms[room], {[playerName]: passThroughMessage})
    }
  });
}



export { handleRoomSetup, ROOM_DATABASE };
