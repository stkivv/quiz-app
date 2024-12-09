import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Player } from '../dtos/player-dto';
import { Question } from '../dtos/question-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { EButtonType } from '../button/EButtonType';
import { AnswerDto } from '../dtos/answer-dto';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-game',
  standalone: true,
  imports: [ButtonComponent, FormsModule],
  templateUrl: './player-game.component.html',
  styleUrl: './player-game.component.css',
  providers: [WebsocketService]
})
export class PlayerGameComponent {
  playername = "";
  players: Player[] = [];
  passcode = "";
  question: Question | null = null;
  correctAnswer = "";
  roundOver = false;
  selectedOption = "";

  constructor(private router: Router, private route: ActivatedRoute, private websocketService: WebsocketService) {
    this.passcode = this.route.snapshot.paramMap.get('passcode')!;
    this.playername = this.route.snapshot.paramMap.get('playername')!;
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
      this.router.navigate([this.passcode + '/scoreboard']);
    });

    this.websocketService.subscribe(`/topic/${this.passcode}/roundover`, (msg) => {
      const isOver: boolean = JSON.parse(msg.body);
      if (!isOver) return;
      console.log("Round over");
      this.roundOver = true;
    });

    this.websocketService.sendMessage(`/app/${this.passcode}/getquestion`, "");
  }

  confirmBtnType = EButtonType.CONFIRM;
  confirmBtnLabel = "Answer";
  onConfirm() {
    if (!this.selectedOption || !this.playername) return;

    const answer: AnswerDto = { answer: this.selectedOption, playername: this.playername };
    const answerJson = JSON.stringify(answer);
    this.websocketService.sendMessage(`/app/${this.passcode}/answer`, answerJson);
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
