import { CardGridView } from "./card-grid";

export type GameBoard = {
    players: {
        [id in string]: {
            playerName: string;
            cardGrid: CardGridView;
        }
    }
}


export const COLUMN_COUNT = 3;