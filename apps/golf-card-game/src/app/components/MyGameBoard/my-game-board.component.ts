import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardGridView, CardPosition } from '@golf-card-game/interfaces';
import { CardColumnComponent } from '../CardColumn/card-column.component';

@Component({
  selector: 'golf-card-game-my-game-board',
  standalone: true,
  imports: [CommonModule, CardColumnComponent],
  templateUrl: './my-game-board.component.html',
  styleUrls: ['./my-game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyGameBoardComponent {
  @Input()
  isMyTurn!: boolean;

  @Input()
  currentPlayer!: {
    playerName: string;
    cardGrid: CardGridView;
  } | null;

  @Output()
  revealCard = new EventEmitter<CardPosition>();

  notifyCardClicked(columnIndex: number, event: {
    cardPositionIndex: number;
  }) {
    this.revealCard.emit({
      columnIndex,
      cardPositionIndex: event.cardPositionIndex
    })
  }
}
