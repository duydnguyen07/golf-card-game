import { CardInADeck } from './card';

export interface CardGrid {
  col1: {
    isRevealed: boolean;
    name: CardInADeck;
  }[];
  col2: {
    isRevealed: boolean;
    name: CardInADeck;
  }[];
  col3: {
    isRevealed: boolean;
    name: CardInADeck;
  }[];
}

export interface CardGridView {
  col1: {
    isRevealed: boolean;
    name: CardInADeck | null;
  }[];
  col2: {
    isRevealed: boolean;
    name: CardInADeck | null;
  }[];
  col3: {
    isRevealed: boolean;
    name: CardInADeck | null;
  }[];
}

export function generateCardGrid(): CardGrid {
  return {
    col1: [],
    col2: [],
    col3: [],
  };
}

export interface CardPosition {
  columnIndex: number;
  cardPositionIndex: number;
}

export type Score = {
  [playerId in string]: number;
}
