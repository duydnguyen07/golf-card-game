import { Deck, Rooms, SocketPayload } from '@golf-card-game/interfaces';

function getNextActions(payload: SocketPayload) {}

function drawACard(roomDatabase: Rooms, room: string): {
    leftOverCards: Partial<Deck>[],
    drawnCard: Partial<Deck>
} | undefined {
  if (roomDatabase[room]?.leftOverCards.length > 0) {
    const leftOverCards = [
        ...roomDatabase[room].leftOverCards
    ];
    const randomlyDrawnCardIndex = Math.floor(
      Math.random() * (leftOverCards.length - 1)
    );
    
    const drawnCard = roomDatabase[room].leftOverCards.splice(randomlyDrawnCardIndex, 1)[0];

    return {
        leftOverCards,
        drawnCard
    };
  } else {
    console.error('Cannot draw card for room without any left over cards');
  }
}

export { getNextActions, drawACard };
