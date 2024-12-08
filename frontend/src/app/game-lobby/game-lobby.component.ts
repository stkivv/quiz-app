import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Quiz } from '../dtos/quiz-dto';
import { Player } from '../dtos/player-dto';
import { EButtonType } from '../button/EButtonType';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-game-lobby',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './game-lobby.component.html',
  styleUrl: './game-lobby.component.css',
  providers: [WebsocketService]
})
export class GameLobbyComponent {
  quizId = "";
  quizTitle = "";
  username = "";
  passcode = "please wait...";
  players = [] as Player[];

  constructor(private webSocketService: WebsocketService,
    private backendService: BackendService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.quizId = this.route.firstChild?.snapshot.paramMap.get('quizid')!;
    this.username = this.route.snapshot.paramMap.get('username')!;

    const url = "quiz/" + this.quizId;
    this.backendService.doGet<Quiz>(url, 'json').subscribe(quiz => {
      this.quizTitle = quiz.title;
    });

    this.webSocketService.connect();

    this.webSocketService.subscribe(`/topic/${this.quizId}/host`, (message) => {
      this.passcode = message.body;

      this.webSocketService.subscribe(`/topic/${message.body}/players`, (playersMessage) => {
        this.players = JSON.parse(playersMessage.body);
      });

      this.webSocketService.subscribe(`/topic/${this.passcode}/start`, () => {
        this.router.navigate([`${this.username}/game/${this.passcode}/host`]);
      });
    });

    this.webSocketService.sendMessage(`/app/${this.quizId}/host`, this.username);

  }

  cancelBtnLabel = "Cancel";
  cancelBtnType = EButtonType.CANCEL;
  cancelBtnClick = () => {
    this.router.navigate([this.username + '/dashboard']);
  };

  startBtnLabel = "Start";
  startBtnType = EButtonType.CONFIRM;
  startBtnClick = () => {
    this.webSocketService.sendMessage(`/app/${this.passcode}/start`, this.username);
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

}
