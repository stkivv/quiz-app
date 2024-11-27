import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-game-lobby',
  standalone: true,
  imports: [],
  templateUrl: './game-lobby.component.html',
  styleUrl: './game-lobby.component.css'
})
export class GameLobbyComponent {
  quizId = "";
  username = "";
  passcode = new FormControl("please wait...");
  constructor(private webSocketService: WebsocketService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.quizId = this.route.firstChild?.snapshot.paramMap.get('quizid')!;
    this.username = this.route.snapshot.paramMap.get('username')!;

    this.webSocketService.connect();

    this.webSocketService.subscribe(`/topic/${this.quizId}/host`, (message) => {
      this.passcode = new FormControl(message.body);
    });

    this.webSocketService.sendMessage(`/app/${this.quizId}/host`, this.username);
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

}
