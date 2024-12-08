import { Component } from '@angular/core';
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
  players = ([] as Player[]);
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
      this.question?.options.forEach(q => {
        if (q.correctAnswer) {
          this.correctAnswer = q.phrasing
        }
      })
    });

    this.websocketService.subscribe(`/topic/${this.passcode}/finished`, () => {
      //todo!! finish screen before navigating to dashboard
      console.log("game finished");
      this.router.navigate([this.username + '/dashboard']);
    });

    // this is called when the server detects that all players have answered
    this.websocketService.subscribe(`/topic/${this.passcode}/answered`, () => {
      this.roundOver = true;
      this.websocketService.sendMessage(`/app/${this.passcode}/players`, "");
    });

    this.websocketService.sendMessage(`/app/${this.passcode}/question`, "");
  }


  // skip manually ends the round
  skipBtnType = EButtonType.NEUTRAL;
  skipBtnLabel = "Skip";
  onSkip() {
    this.roundOver = true;
    this.websocketService.sendMessage(`/app/${this.passcode}/players`, "");
  }

  nextBtnType = EButtonType.CONFIRM;
  nextBtnLabel = "Next";
  onNext() {
    this.websocketService.sendMessage(`/app/${this.passcode}/question`, "");
  }

  exitBtnType = EButtonType.DANGER;
  exitBtnLabel = "Exit";
  onExit() {
    this.websocketService.sendMessage(`/app/${this.passcode}/finished`, "");
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
