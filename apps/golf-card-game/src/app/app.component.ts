import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { CardSuite, Deck } from '@golf-card-game/interfaces';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'golf-card-game-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'golf-card-game';

  deck: Deck = [
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
    CardSuite.Ace_Diamond
  ]
}
