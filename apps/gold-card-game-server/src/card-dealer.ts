import {
  COLUMN_COUNT,
  Card,
  CardGrid,
  CardSuite,
  Deck,
  PlayerProfile,
  Rooms,
  SetPlayerHandPayload,
  ClientSocketAction,
  ServerSocketAction,
} from '@golf-card-game/interfaces';
import { WebSocket } from 'ws';

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
];

function deal9Cards(
  deckCount: number,
  playerCount: number
): {
  dealtCardsPerPlayer: {
    [playerIndex in number]: CardGrid;
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
  [playerIndex in number]: CardGrid;
} {
  const dealtCards: Partial<Deck> = [...inputs.cardIndexSet.values()].map(
    (deckIndex: number) => {
      return inputs.fullDeck[deckIndex];
    }
  ) as unknown as Partial<Deck>;

  const result: {
    [playerIndex in number]: CardGrid;
  } = {};

  for (let i = 0; i < dealtCards.length; i++) {
    const playerIndex = Math.floor(i / inputs.cardNumberPerPlayer);
    const cardProfile = {
      isRevealed: false,
      name: dealtCards[i] as unknown as Partial<Deck>,
    };
    if (!!result[playerIndex]) {
      const remainder = i % COLUMN_COUNT;

      if (remainder === 0) {
        result[playerIndex].col1.push(cardProfile);
      } else if (remainder === 1) {
        result[playerIndex].col2.push(cardProfile);
      } else if (remainder === 2) {
        result[playerIndex].col3.push(cardProfile);
      }
    } else {
      result[playerIndex] = {
        col1: [cardProfile],
        col2: [],
        col3: [],
      };
    }
  }

  return result;
}

function notifyAllPlayersAboutDealtCards(playersInRoom: [string, PlayerProfile][], room: string) {
  playersInRoom.forEach(([currentPlayerId, currentPlayerProfile]) => {
    notifyCurrentPlayerAboutTheirCard(
      currentPlayerProfile.socket,
      room,
      currentPlayerProfile,
      currentPlayerId
    );
    notifyCurrentPlayerAboutOtherPlayersCard(
      room,
      currentPlayerProfile.socket,
      currentPlayerId,
      playersInRoom
    );
  });
}

function notifyCurrentPlayerAboutTheirCard(
  socket: WebSocket,
  room: string,
  currentPlayerProfile: PlayerProfile,
  currentPlayerId: string
) {
  const payload: SetPlayerHandPayload = {
    action: ServerSocketAction.SetPlayerHand,
    playerName: currentPlayerProfile.playerName,
    cardGrid: currentPlayerProfile.cards,
    room,
    playerId: currentPlayerId,
    passThroughMessage: null,
  };

  payload.cardGrid = {
    col1: payload.cardGrid.col1.map((cardProfile, index) => {
      return index === 0 ? { ...cardProfile } : { ...cardProfile, name: null };
    }),
    col2: convertToMaskedColumn(payload.cardGrid.col2),
    col3: payload.cardGrid.col3.map((cardProfile, index) => {
      return index === 0 ? { ...cardProfile } : { ...cardProfile, name: null };
    }),
  };

  socket.send(JSON.stringify(payload));
}

function notifyCurrentPlayerAboutOtherPlayersCard(
  room: string,
  currentPlayerSocket: WebSocket,
  currentPlayerId: string,
  playersInRoom: [string, PlayerProfile][]
) {
  playersInRoom.forEach(([otherPlayerId, playerProfile]) => {
    if (otherPlayerId !== currentPlayerId) {
      const payload: SetPlayerHandPayload = {
        action: ServerSocketAction.SetPlayerHand,
        playerName: playerProfile.playerName,
        cardGrid: playerProfile.cards,
        room,
        playerId: otherPlayerId,
        passThroughMessage: null,
      };

      payload.cardGrid = {
        col1: convertToMaskedColumn(payload.cardGrid.col1),
        col2: convertToMaskedColumn(payload.cardGrid.col2),
        col3: convertToMaskedColumn(payload.cardGrid.col3),
      };

      currentPlayerSocket.send(JSON.stringify(payload));
    }
  });
}

function convertToMaskedColumn(
  column: {
    isRevealed: boolean;
    name: Partial<Deck> | null;
  }[]
) {
  return column.map((cardProfile) => ({
    ...cardProfile,
    name: null,
  }));
}

export { deal9Cards, notifyAllPlayersAboutDealtCards };
