import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Card,
  CardSuite,
  Deck,
  SocketAction,
  SocketJoinPayload,
  SocketPayload,
} from '@golf-card-game/interfaces';
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

    const subject = webSocket<SocketPayload>('ws://localhost:3333/ws'); //TODO: handle this, we cannot let it be any value

    subject.subscribe({
      next: (message) => console.log(message),
      error: (err) => console.error(err),
      complete: () => console.log('completed!'),
    });
    const socketPayload: SocketJoinPayload = {
      playerName: Math.random() + '',
      playerId: '',
      passThroughMessage: null,
      action: SocketAction.Join,
      room: '123',
    };
    subject.next(socketPayload);

    subject.next({
      passThroughMessage: 'wasssssupppp' + Math.random(),
      action: SocketAction.Join,
      room: '123',
      playerId: 'string'
    });
  }
}
