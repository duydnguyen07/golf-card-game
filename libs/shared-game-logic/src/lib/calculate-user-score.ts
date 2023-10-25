import {
  CardValue,
  CardInADeck,
  CardGrid,
  CardGridView,
} from '@golf-card-game/interfaces';

function calculateSumForColumn(
  column: {
    isRevealed: boolean;
    name: CardInADeck | null;
  }[]
) {
  const areAllCardsTheSame = column.every(
    (cardProfile) =>
      cardProfile.isRevealed && cardProfile.name === column[0].name
  );

  if (areAllCardsTheSame) {
    return 0;
  } else {
    return column.reduce((sum, cardProfile) => {
      return cardProfile.isRevealed && !!cardProfile.name
        ? sum + CardValue[cardProfile.name]
        : sum;
    }, 0);
  }
}

function calculateSumForPlayer(cardGrid: CardGrid | CardGridView) {
  const col1Sum = calculateSumForColumn(cardGrid.col1);
  const col2Sum = calculateSumForColumn(cardGrid.col2);
  const col3Sum = calculateSumForColumn(cardGrid.col3);

  return col1Sum + col2Sum + col3Sum;
}

export { calculateSumForPlayer, calculateSumForColumn };
