import {
  CardInADeck,
  Rooms,
  ServerSocketAction,
  SetPlayerHandPayload,
} from '@golf-card-game/interfaces';
import { broadcastMessageToAllPlayersInRoom } from './socket-util';

function revealAllCards(
  roomName: string,
  roomDatabase: Rooms,
  playerId: string
) {
  const playerProfile = roomDatabase[roomName].players[playerId];

  const payload: SetPlayerHandPayload = {
    action: ServerSocketAction.SetPlayerHand,
    playerName: playerProfile.playerName,
    cardGrid: playerProfile.cards,
    room: roomName,
    playerId: playerId,
  };

  revealAllCardsInColumn(payload.cardGrid.col1);
  revealAllCardsInColumn(payload.cardGrid.col2);
  revealAllCardsInColumn(payload.cardGrid.col3);

  broadcastMessageToAllPlayersInRoom(
    roomDatabase,
    roomName,
    JSON.stringify(payload)
  );
}

function revealAllCardsInColumn(
  col: {
    isRevealed: boolean;
    name: CardInADeck | null;
  }[]
) {
  col.forEach((cardProfile) => {
    cardProfile.isRevealed = true;
  });
}

export { revealAllCards };
