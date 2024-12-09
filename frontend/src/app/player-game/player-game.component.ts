import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Player } from '../dtos/player-dto';
import { Question } from '../dtos/question-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { EButtonType } from '../button/EButtonType';
import { AnswerDto } from '../dtos/answer-dto';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';
import { GameService } from '../game.service';

@Component({
  selector: 'app-player-game',
  standalone: true,
  imports: [ButtonComponent, FormsModule],
  templateUrl: './player-game.component.html',
  styleUrl: './player-game.component.css',
  providers: [WebsocketService, GameService]
})
export class PlayerGameComponent {
  playername = "";
  players: Player[] = [];
  passcode = "";
  question: Question | null = null;
  correctAnswer = "";
  roundOver = false;
  selectedOption = "";

  constructor(private router: Router, private route: ActivatedRoute, private gameService: GameService) {
    this.passcode = this.route.snapshot.paramMap.get('passcode')!;
    this.playername = this.route.snapshot.paramMap.get('playername')!;
  }

  ngOnInit() {
    this.gameService.connectToWebsocket(this.passcode);

    this.gameService.subscribeToPlayerList((players: Player[]) => {
      this.players = players
    });

    this.gameService.subscribeToNewQuestionEvent((question: Question) => {
      this.roundOver = false;
      this.question = question
      this.correctAnswer = this.question!.options.find(q => q.correctAnswer)!.phrasing;
    });

    this.gameService.subscribeToGameFinishedEvent(() => {
      this.router.navigate([this.passcode + '/scoreboard']);
    });

    this.gameService.subscribeToRoundOverEvent(() => {
      this.roundOver = true;
    });

    this.gameService.getQuestion();
  }

  confirmBtnType = EButtonType.CONFIRM;
  confirmBtnLabel = "Answer";
  onConfirm() {
    if (!this.selectedOption || !this.playername) return;

    const answer: AnswerDto = { answer: this.selectedOption, playername: this.playername };
    const answerJson = JSON.stringify(answer);
    this.gameService.sendAnswer(answerJson);
  }

  ngOnDestroy(): void {
    this.gameService.disconnectFromWebsocket();
  }
}
