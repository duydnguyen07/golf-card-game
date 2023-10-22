import { Pipe, PipeTransform } from '@angular/core';
import { CardGridView } from '@golf-card-game/interfaces';
import { calculateSumForPlayer } from '@golf-card-game/shared-game-logic';

@Pipe({
  name: 'totalPoints',
  standalone: true
})
export class TotalPointsPipe implements PipeTransform {
  transform(cards: CardGridView) {
    return calculateSumForPlayer(cards)
  }
}
