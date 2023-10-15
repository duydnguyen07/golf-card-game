import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Deck } from '@golf-card-game/interfaces';

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
  column!: {
    isRevealed: boolean;
    name: Partial<Deck> | null;
  }[];

  @Output()
  cardClicked = new EventEmitter<{
    cardPositionIndex: number;
  }>();
}
