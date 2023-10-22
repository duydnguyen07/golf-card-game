import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardInADeck } from '@golf-card-game/interfaces';

@Component({
  selector: 'golf-card-game-card-column',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-column.component.html',
  styleUrls: ['./card-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardColumnComponent {
  @Input()
  readonly!: boolean;

  @Input()
  column!: {
    isRevealed: boolean;
    name: CardInADeck | null;
  }[];

  @Output()
  cardClicked = new EventEmitter<{
    cardPositionIndex: number;
  }>();
}
