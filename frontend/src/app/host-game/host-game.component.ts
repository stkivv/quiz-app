import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { Player } from '../dtos/player-dto';
import { Question } from '../dtos/question-dto';
import { EButtonType } from '../button/EButtonType';
import { GameService } from '../game.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

@Component({
  selector: 'app-host-game',
  standalone: true,
  imports: [ButtonComponent, LeaderboardComponent],
  templateUrl: './host-game.component.html',
  styleUrl: './host-game.component.css',
  providers: [WebsocketService, GameService]
})
export class HostGameComponent {
  username = "";
  players: Player[] = [];
  passcode = "";
  question: Question | null = null;
  correctAnswer = "";
  roundOver = false;
  alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(private router: Router, private route: ActivatedRoute, private gameService: GameService) {
    this.passcode = this.route.snapshot.paramMap.get('passcode')!;
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  ngOnInit() {
    this.gameService.connectToWebsocket(this.passcode);

    this.gameService.subscribeToPlayerList((players: Player[]) => {
      this.players = players;
    });

    this.gameService.subscribeToNewQuestionEvent((question: Question) => {
      this.roundOver = false;
      this.question = question;
      this.correctAnswer = this.question!.options.find(q => q.correctAnswer)!.phrasing;
    })

    this.gameService.subscribeToGameFinishedEvent(() => {
      this.router.navigate([this.passcode + '/scoreboard'], {
        queryParams: {
          username: this.username
        }
      });
    });

    this.gameService.subscribeToRoundOverEvent(() => {
      this.roundOver = true;
      this.gameService.getPlayers();
    })

    this.gameService.getQuestion();
  }


  // skip manually ends the round
  skipBtnType = EButtonType.NEUTRAL;
  skipBtnLabel = "Skip";
  onSkip() {
    this.roundOver = true;
    this.gameService.sendRoundOverSignal();
  }

  nextBtnType = EButtonType.CONFIRM;
  nextBtnLabel = "Next";
  onNext() {
    this.gameService.getQuestion();
  }

  exitBtnType = EButtonType.DANGER;
  exitBtnLabel = "End";
  onExit() {
    this.gameService.sendGameFinishedSignal();
  }

  ngOnDestroy(): void {
    this.gameService.disconnectFromWebsocket();
  }
}
