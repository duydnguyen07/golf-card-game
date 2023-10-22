import {
  GameEndedPayload,
  Room,
  Rooms,
  Score,
  ServerSocketAction,
} from '@golf-card-game/interfaces';
import { getNextPlayerId } from './game-logic-engine';
import { calculateSumForPlayer } from '@golf-card-game/shared-game-logic';
import { broadcastMessageToAllPlayersInRoom } from './socket-util';

function handleGameEnd({
  roomDatabase,
  roomName,
}: {
  roomDatabase: Rooms;
  roomName: string;
}) {
  const room = roomDatabase[roomName];

  const playerScores = calculateFinalScore(room);
  const payload: GameEndedPayload = {
    room: roomName,
    playerId: playerScores.winnerId,
    action: ServerSocketAction.GameEnded,
    playerScores: playerScores.scores,
    playerName: room.players[playerScores.winnerId].playerName
  };
  broadcastMessageToAllPlayersInRoom(
    roomDatabase,
    roomName,
    JSON.stringify(payload)
  );
}

function calculateFinalScore(room: Room): {
  scores: Score[];
  winnerId: string;
} {
  let heightScorePlayerId = '';
  let heightScore = -Infinity;
  const scores: Score[] = Object.keys(room.players).map((playerId) => {
    const sum = calculateSumForPlayer(room.players[playerId].cards);
    if (sum > heightScore) {
      heightScorePlayerId = playerId;
    }

    return {
      [playerId]: sum,
    };
  });

  return {
    scores,
    winnerId: heightScorePlayerId,
  };
}

function isGameOver(room: Room) {
  let isGameOver = false;
  if (room.lastRoundTriggeredByPlayerId) {
    const nextPlayerId = getNextPlayerId(room);
    isGameOver = nextPlayerId === room.lastRoundTriggeredByPlayerId;
  }

  return isGameOver;
}

export { handleGameEnd, isGameOver };
