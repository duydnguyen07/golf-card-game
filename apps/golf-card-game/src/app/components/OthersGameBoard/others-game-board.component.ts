import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardGridView } from '@golf-card-game/interfaces';
import { ViewOnlyCardColumnComponent } from '../ViewOnlyCardColumn/view-only-card-column.component';
import { TotalPointsPipe } from '../../pipes/total-points.pipe';

@Component({
  selector: 'golf-card-game-others-game-board',
  standalone: true,
  imports: [CommonModule, ViewOnlyCardColumnComponent, TotalPointsPipe],
  templateUrl: './others-game-board.component.html',
  styleUrls: ['./others-game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OthersGameBoardComponent {
  @Input()
  players!: {
    playerId: string;
    playerName: string;
    cardGrid: CardGridView;
  }[]

  
}
