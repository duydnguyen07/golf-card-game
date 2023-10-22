import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardGridView, CardPosition } from '@golf-card-game/interfaces';
import { CardColumnComponent } from '../CardColumn/card-column.component';
import { TotalPointsPipe } from '../../pipes/total-points.pipe';

@Component({
  selector: 'golf-card-game-my-game-board',
  standalone: true,
  imports: [CommonModule, CardColumnComponent, TotalPointsPipe],
  templateUrl: './my-game-board.component.html',
  styleUrls: ['./my-game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyGameBoardComponent {
  @Input()
  isDisabled!: boolean;

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
