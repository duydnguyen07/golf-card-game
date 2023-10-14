import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Card,
  CardSuite,
  Deck,
  NewPlayerJoinedSuccessPayload,
  SocketAction,
  SocketJoinPayload,
  SocketPayload,
} from '@golf-card-game/interfaces';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';
import { RoomService } from './room.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule],
  selector: 'golf-card-game-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'golf-card-game';
  ROOM_NAME = '123'; //TODO: make this room name unique

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    public roomService: RoomService
  ) {
    this.initSocketConnection(this.userService.websocketSubject);
  }

  deal() {
    firstValueFrom(this.httpClient.get('/deal'));
  }

  private initSocketConnection(subject: WebSocketSubject<SocketPayload>) {
    subject.subscribe({
      next: (message) => {
        if (message.action === SocketAction.JoinedSuccess) {
          this.userService.setUserId(message.playerId);
        } else if (message.action === SocketAction.NewPlayerJoinedSuccess) {
          this.roomService.addPlayer(
            (message as NewPlayerJoinedSuccessPayload).playerName,
            message.playerId
          );
        } else if (message.action === SocketAction.ExistingPlayerLeft) {
          this.roomService.removePlayer(message.playerId);
        }
        console.log(message);
      },
      error: (err) => console.error(err),
      complete: () => console.log('completed!'),
    });

    this.joinRoom(subject);
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
