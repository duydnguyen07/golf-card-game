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
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { UserService } from './user.service';

@Component({
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  selector: 'golf-card-game-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'golf-card-game';
  ROOM_NAME = '123'; //TODO: make this room name unique
  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    this.httpClient.get('/deal').subscribe(console.log);

    this.initSocketConnection(this.userService.websocketSubject);
  }

  private initSocketConnection(subject: WebSocketSubject<SocketPayload>) {
    subject.subscribe({
      next: (message) => {
        if (message.action === SocketAction.JoinedSuccess) {
          this.userService.setUserId(message.playerId);
        }
        console.log(message);
      },
      error: (err) => console.error(err),
      complete: () => console.log('completed!'),
    });

    this.joinRoom(subject);


    // TODO: draw diagram to show workflow of the actual game. Idea so far: keep the game board distributed, that means that the frontend has a complete game board and knows the logic of what state it is in. What the next steps are and who's turn it is
    
    // subject.next({
    //   passThroughMessage: 'wasssssupppp' + Math.random(),
    //   action: SocketAction.Join,
    //   room: this.ROOM_NAME,
    //   playerId: 'string',
    // });
  }

  private joinRoom(subject: WebSocketSubject<SocketPayload>) {
    const socketPayload: SocketJoinPayload = {
      playerName: Math.random() + '',
      playerId: '',
      passThroughMessage: null,
      action: SocketAction.Join,
      room: this.ROOM_NAME,
    };
    subject.next(socketPayload);
  }
}
