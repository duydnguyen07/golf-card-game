import {
  CardInADeck,
  CardPosition,
  NotifyErrorPayload,
  PlayerProfile,
  Rooms,
  ServerSocketAction,
  SetLastRoundPayload,
  SetRevealedCardPayload,
} from '@golf-card-game/interfaces';
import { broadcastMessageToAllPlayersInRoom } from './socket-util';

function handleRevealCard({
  roomDatabase,
  roomName,
  playerId,
  cardPosition,
}: {
  roomDatabase: Rooms;
  roomName: string;
  playerId: string;
  cardPosition: CardPosition;
}) {
  const room = roomDatabase[roomName];
  const playerProfile = room.players[playerId];
  const cardInfo: {
    isRevealed: boolean;
    name: CardInADeck;
  } | null = getAndRevealCardAtPosition(cardPosition, playerProfile);

  if (cardInfo) {
    const payload: SetRevealedCardPayload = {
      action: ServerSocketAction.SetRevealedCard,
      room: roomName,
      playerId,
      revealedCard: cardInfo.name,
      cardPosition: cardPosition
    };

    broadcastMessageToAllPlayersInRoom(
      roomDatabase,
      roomName,
      JSON.stringify(payload)
    );

    const hasRevealedAll = hasThisPlayerRevealAllCards(playerProfile);

    if (hasRevealedAll && !room.lastRoundTriggeredByPlayerId) {
      room.lastRoundTriggeredByPlayerId = playerId;

      const payload: SetLastRoundPayload = {
        action: ServerSocketAction.SetLastRound,
        room: roomName,
        playerId,
      };

      broadcastMessageToAllPlayersInRoom(
        roomDatabase,
        roomName,
        JSON.stringify(payload)
      );
    }
  } else {
    const payload: NotifyErrorPayload = {
      action: ServerSocketAction.Error,
      room: roomName,
      playerId,
      errorMessage: 'Cannot find card at selected positionb',
    };

    broadcastMessageToAllPlayersInRoom(
      roomDatabase,
      roomName,
      JSON.stringify(payload)
    );
  }
}

function hasThisPlayerRevealAllCards(playerProfile: PlayerProfile) {
  const isFirstColumnReveal = playerProfile.cards.col1.every(
    (cardInfo) => cardInfo.isRevealed
  );
  const isSecondColumnReveal = playerProfile.cards.col2.every(
    (cardInfo) => cardInfo.isRevealed
  );
  const isThirdColumnReveal = playerProfile.cards.col3.every(
    (cardInfo) => cardInfo.isRevealed
  );

  return isFirstColumnReveal && isSecondColumnReveal && isThirdColumnReveal;
}

function getAndRevealCardAtPosition(
  cardPosition: CardPosition,
  playerProfile: PlayerProfile
) {
  let card: {
    isRevealed: boolean;
    name: CardInADeck;
  } | null = null;

  if (cardPosition.columnIndex === 0) {
    card = playerProfile.cards.col1[cardPosition.cardPositionIndex];
  } else if (cardPosition.columnIndex === 1) {
    card = playerProfile.cards.col2[cardPosition.cardPositionIndex];
  } else if (cardPosition.columnIndex === 2) {
    card = playerProfile.cards.col3[cardPosition.cardPositionIndex];
  }
  //Set card to true

  if (card) {
    card.isRevealed = true;
  }

  return card;
}

export { handleRevealCard };
