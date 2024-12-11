import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { Quiz } from '../dtos/quiz-dto';
import { Player } from '../dtos/player-dto';
import { EButtonType } from '../button/EButtonType';
import { ButtonComponent } from '../button/button.component';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-lobby',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './game-lobby.component.html',
  styleUrl: './game-lobby.component.css',
  providers: [WebsocketService, GameService]
})
export class GameLobbyComponent {
  quizId = "";
  quizTitle = "";
  username = "";
  passcode = "please wait...";
  players = [] as Player[];

  constructor(private gameService: GameService,
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

    // initially connect without passcode because it doesnt exist yet
    // NB! passcode is added with subscribeToHostEvent().
    this.gameService.connectToWebsocket("");

    this.gameService.subscribeToHostEvent(this.quizId, (passcode: string) => {
      this.passcode = passcode;

      this.gameService.subscribeToPlayerList((players: Player[]) => {
        this.players = players;
      });

      this.gameService.subscribeToGameStartEvent(() => {
        this.router.navigate([`${this.username}/game/${this.passcode}/host`]);
      });
    });

    this.gameService.hostGame(this.quizId, this.username);
  }

  cancelBtnLabel = "Cancel";
  cancelBtnType = EButtonType.CANCEL;
  cancelBtnClick = () => {
    this.router.navigate([this.username + '/dashboard']);
  };

  startBtnLabel = "Start";
  startBtnType = EButtonType.CONFIRM;
  startBtnClick = () => {
    this.gameService.startGame(this.username);
  }

  ngOnDestroy(): void {
    this.gameService.disconnectFromWebsocket();
  }

}
