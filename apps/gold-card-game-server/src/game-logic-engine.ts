import { CardInADeck, Room } from '@golf-card-game/interfaces';

function drawACard(
  leftOverCards: CardInADeck[],
  currentlyDrawnCard?: CardInADeck
):
  | {
      leftOverCards: CardInADeck[];
      drawnCard: CardInADeck;
    }
  | undefined {
  const clonedLeftOverCards = [...leftOverCards];

  if (clonedLeftOverCards.length > 0) {
    const firstCardInDeck = clonedLeftOverCards.splice(0, 1)[0];

    if (currentlyDrawnCard) {
      clonedLeftOverCards.push(currentlyDrawnCard);
    }

    return {
      leftOverCards: clonedLeftOverCards,
      drawnCard: firstCardInDeck,
    };
  } else {
    console.error(
      'Cannot draw card without any leftover cards',
      JSON.stringify(leftOverCards)
    );
  }
}

function getNextPlayerId(room: Room) {
  const playerIds = Object.keys(room.players);
  const randomPlayerIndex = Math.floor(Math.random() * (playerIds.length - 1));
  let result = playerIds[randomPlayerIndex];
  const indexOfCurrentPlayer = playerIds.indexOf(room.currentTurnPlayerId);

  if (indexOfCurrentPlayer > -1) {
    result = playerIds[(indexOfCurrentPlayer + 1) % playerIds.length];
  }

  return result;
}

export { drawACard, getNextPlayerId };
