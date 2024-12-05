import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
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
  styleUrl: './game-lobby.component.css'
})
export class GameLobbyComponent {
  quizId = "";
  quizTitle = new FormControl("");
  username = "";
  passcode = new FormControl("please wait...");
  players = new FormControl([] as Player[]);

  constructor(private webSocketService: WebsocketService,
    private backendService: BackendService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.quizId = this.route.firstChild?.snapshot.paramMap.get('quizid')!;
    this.username = this.route.snapshot.paramMap.get('username')!;

    const url = "quiz/" + this.quizId;
    this.backendService.doGet<Quiz>(url, 'json').subscribe(quiz => {
      this.quizTitle = new FormControl(quiz.title);
    });

    this.webSocketService.connect();

    this.webSocketService.subscribe(`/topic/${this.quizId}/host`, (message) => {
      this.passcode = new FormControl(message.body);

      this.webSocketService.subscribe(`/topic/${message.body}/players`, (playersMessage) => {
        const players: Player[] = JSON.parse(playersMessage.body);
        this.players = new FormControl(players);
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
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

}
