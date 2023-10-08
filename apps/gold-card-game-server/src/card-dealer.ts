import { Card, CardSuite, Deck } from '@golf-card-game/interfaces';

const deck: Deck = [
    CardSuite.Two_Spade,
    CardSuite.Three_Spade,
    CardSuite.Four_Spade,
    CardSuite.Five_Spade,
    CardSuite.Six_Spade,
    CardSuite.Seven_Spade,
    CardSuite.Eight_Spade,
    CardSuite.Nine_Spade,
    CardSuite.Ten_Spade,
    CardSuite.Jack_Spade,
    CardSuite.Queen_Spade,
    CardSuite.King_Spade,
    CardSuite.Ace_Spade,
    CardSuite.Two_Club,
    CardSuite.Three_Club,
    CardSuite.Four_Club,
    CardSuite.Five_Club,
    CardSuite.Six_Club,
    CardSuite.Seven_Club,
    CardSuite.Eight_Club,
    CardSuite.Nine_Club,
    CardSuite.Ten_Club,
    CardSuite.Jack_Club,
    CardSuite.Queen_Club,
    CardSuite.King_Club,
    CardSuite.Ace_Club,
    CardSuite.Two_Heart,
    CardSuite.Three_Heart,
    CardSuite.Four_Heart,
    CardSuite.Five_Heart,
    CardSuite.Six_Heart,
    CardSuite.Seven_Heart,
    CardSuite.Eight_Heart,
    CardSuite.Nine_Heart,
    CardSuite.Ten_Heart,
    CardSuite.Jack_Heart,
    CardSuite.Queen_Heart,
    CardSuite.King_Heart,
    CardSuite.Ace_Heart,
    CardSuite.Two_Diamond,
    CardSuite.Three_Diamond,
    CardSuite.Four_Diamond,
    CardSuite.Five_Diamond,
    CardSuite.Six_Diamond,
    CardSuite.Seven_Diamond,
    CardSuite.Eight_Diamond,
    CardSuite.Nine_Diamond,
    CardSuite.Ten_Diamond,
    CardSuite.Jack_Diamond,
    CardSuite.Queen_Diamond,
    CardSuite.King_Diamond,
    CardSuite.Ace_Diamond,
    Card.Joker1,
    Card.Joker2,
  ]

function deal9Cards(
  deckCount: number,
  playerCount: number
): {
  dealtCardsPerPlayer: {
    [key in number]: Partial<Deck>[];
  };
  leftOver: Partial<Deck>[];
} {
  const CARD_NUMBER_PER_PLAYER = 9;
  let fullDeck: Deck[] = [];

  for (let count = 0; count < deckCount; count++) {
    fullDeck = fullDeck.concat([...deck]);
  }

  const deckSize = fullDeck.length - 1;
  const cardIndexSet = new Set<number>();
  const maxCount = playerCount * CARD_NUMBER_PER_PLAYER;

  do {
    const newCardPosition = Math.floor(Math.random() * deckSize);
    if (!cardIndexSet.has(newCardPosition)) {
      cardIndexSet.add(newCardPosition);
    }
  } while (cardIndexSet.size < maxCount);

  const result = {
    dealtCardsPerPlayer: dealCardToEachPlayer({
      playerCount,
      cardNumberPerPlayer: CARD_NUMBER_PER_PLAYER,
      cardIndexSet,
      fullDeck,
    }),
    leftOver: fullDeck.filter((_, index) => !cardIndexSet.has(index)),
  };

  return result;
}

function dealCardToEachPlayer(inputs: {
  playerCount: number;
  cardNumberPerPlayer: number;
  cardIndexSet: Set<number>;
  fullDeck: Deck[];
}): {
  [key in number]: Partial<Deck>[];
} {
  const dealtCards: Partial<Deck> = [...inputs.cardIndexSet.values()].map(
    (deckIndex: number) => {
      return inputs.fullDeck[deckIndex];
    }
  ) as unknown as Partial<Deck>;

  const result: {
    [key in number]: Partial<Deck>[];
  } = {};

  for (let i = 0; i < dealtCards.length; i++) {
    const playerIndex = Math.floor(i / inputs.cardNumberPerPlayer);

    if (!!result[playerIndex]) {
      result[playerIndex].push(dealtCards[i] as unknown as Partial<Deck>);
    } else {
      result[playerIndex] = [dealtCards[i] as unknown as Partial<Deck>];
    }
  }

  return result;
}

export {
    deal9Cards
}
