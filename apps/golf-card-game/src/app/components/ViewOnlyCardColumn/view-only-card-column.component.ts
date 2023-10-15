import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Deck } from '@golf-card-game/interfaces';

@Component({
  selector: 'golf-card-game-view-only-card-column',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-only-card-column.component.html',
  styleUrls: ['./view-only-card-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewOnlyCardColumnComponent {
  @Input()
  column!: {
    isRevealed: boolean;
    name: Partial<Deck> | null;
  }[];
}
