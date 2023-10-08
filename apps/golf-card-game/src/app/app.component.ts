import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Card, CardSuite, Deck } from '@golf-card-game/interfaces';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { webSocket } from 'rxjs/webSocket';



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
    this.httpClient.get('/deal').subscribe(console.log);

    const subject = webSocket('ws://localhost:3333/ws');

    subject.subscribe({
      next: (message) => console.log(message),
      error: (err) => console.error(err),
      complete: () => console.log('completed!') 
    })

    subject.next({ message: 'wasssssupppp' + Math.random()})
  }
}
