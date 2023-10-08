import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Card, CardSuite, Deck } from '@golf-card-game/interfaces';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  selector: 'golf-card-game-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'golf-card-game';

  constructor(private httpClient: HttpClient) {
    this.httpClient.get('/deal').subscribe(console.log)
  }
}
