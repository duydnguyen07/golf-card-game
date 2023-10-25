import { CardInADeck, CardPosition, Rooms } from '@golf-card-game/interfaces';

function handleSwapCard({
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
  const currentRoom = roomDatabase[roomName];
  const playerCardGrid = currentRoom.players[playerId].cards;
  let cardGridProfile: {
    isRevealed: boolean;
    name: CardInADeck;
  }[] = null;
  if (cardPosition.columnIndex === 0) {
    cardGridProfile = playerCardGrid.col1;
  } else if (cardPosition.columnIndex === 1) {
    cardGridProfile = playerCardGrid.col2;
  } else if (cardPosition.columnIndex === 2) {
    cardGridProfile = playerCardGrid.col3;
  }

  if (cardPosition) {
    const currentPlayerCard = cardGridProfile[cardPosition.cardPositionIndex].name;

    cardGridProfile[cardPosition.cardPositionIndex] = {
      isRevealed: true,
      name: currentRoom.drawnCard,
    };

    //TODO: remove set currentPlayerCard to drawn card
  } else {
    console.error(
      'Cannot determine card grid profile at column index',
      cardPosition.columnIndex
    );
  }
}

export { handleSwapCard };
