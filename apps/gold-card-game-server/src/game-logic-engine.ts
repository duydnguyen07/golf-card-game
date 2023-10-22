import { CardInADeck, Room, Rooms, SocketPayload } from '@golf-card-game/interfaces';

function drawACard(leftOverCards: CardInADeck[]): {
    leftOverCards: CardInADeck[],
    drawnCard: CardInADeck
} | undefined {
  if (leftOverCards.length > 0) {
    const randomlyDrawnCardIndex = Math.floor(
      Math.random() * (leftOverCards.length - 1)
    );
    
    const drawnCard = leftOverCards.splice(randomlyDrawnCardIndex, 1)[0];

    return {
        leftOverCards,
        drawnCard
    };
  } else {
    console.error('Cannot draw card without any leftover cards', JSON.stringify(leftOverCards));
  }
}

function getNextPlayerId(room: Room) {
  const playerIds = Object.keys(room.players);
  const randomPlayerIndex = Math.floor(Math.random()*(playerIds.length - 1));
  let result = playerIds[randomPlayerIndex];
  const indexOfCurrentPlayer = playerIds.indexOf(room.currentTurnPlayerId);

  if(indexOfCurrentPlayer > -1) {
    result = playerIds[(indexOfCurrentPlayer + 1) % playerIds.length]
  } 
  
  return result;
}

export { drawACard, getNextPlayerId };
