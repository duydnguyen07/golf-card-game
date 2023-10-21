import { Deck } from './deck';

export interface CardGrid {
  col1: {
    isRevealed: boolean;
    name: Partial<Deck>;
  }[];
  col2: {
    isRevealed: boolean;
    name: Partial<Deck>;
  }[];
  col3: {
    isRevealed: boolean;
    name: Partial<Deck>;
  }[];
}

export interface CardGridView {
  col1: {
    isRevealed: boolean;
    name: Partial<Deck> | null;
  }[];
  col2: {
    isRevealed: boolean;
    name: Partial<Deck> | null;
  }[];
  col3: {
    isRevealed: boolean;
    name: Partial<Deck> | null;
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
