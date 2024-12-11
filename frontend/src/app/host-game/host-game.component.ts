import { Component, Host } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { Player } from '../dtos/player-dto';
import { Question } from '../dtos/question-dto';
import { EButtonType } from '../button/EButtonType';

@Component({
  selector: 'app-host-game',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './host-game.component.html',
  styleUrl: './host-game.component.css',
  providers: [WebsocketService]
})
export class HostGameComponent {
  username = "";
  players: Player[] = [];
  passcode = "";
  question: Question | null = null;
  correctAnswer = "";
  roundOver = false;

  constructor(private router: Router, private route: ActivatedRoute, private websocketService: WebsocketService) {
    this.passcode = this.route.snapshot.paramMap.get('passcode')!;
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  ngOnInit() {
    this.websocketService.connect();

    this.websocketService.subscribe(`/topic/${this.passcode}/players`, (playersMessage) => {
      this.players = JSON.parse(playersMessage.body);
    });

    this.websocketService.subscribe(`/topic/${this.passcode}/question`, (questionMessage) => {
      this.roundOver = false;
      this.question = JSON.parse(questionMessage.body);
      this.correctAnswer = this.question!.options.find(q => q.correctAnswer)!.phrasing;
    });

    this.websocketService.subscribe(`/topic/${this.passcode}/finished`, () => {
      console.log("game finished");
      this.router.navigate([this.passcode + '/scoreboard'], {
        queryParams: {
          username: this.username
        }
      });
    });

    this.websocketService.subscribe(`/topic/${this.passcode}/roundover`, (msg) => {
      const isOver: boolean = JSON.parse(msg.body);
      if (!isOver) return;
      console.info("round over");
      this.roundOver = true;
      this.websocketService.sendMessage(`/app/${this.passcode}/players`, "");
    });

    this.websocketService.sendMessage(`/app/${this.passcode}/getquestion`, "");
  }


  // skip manually ends the round
  skipBtnType = EButtonType.NEUTRAL;
  skipBtnLabel = "Skip";
  onSkip() {
    this.roundOver = true;
    this.websocketService.sendMessage(`/app/${this.passcode}/roundover`, "");
  }

  nextBtnType = EButtonType.CONFIRM;
  nextBtnLabel = "Next";
  onNext() {
    this.websocketService.sendMessage(`/app/${this.passcode}/getquestion`, "");
  }

  exitBtnType = EButtonType.DANGER;
  exitBtnLabel = "End";
  onExit() {
    this.websocketService.sendMessage(`/app/${this.passcode}/finished`, "");
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
