import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../dtos/player-dto';
import { EButtonType } from '../button/EButtonType';

@Component({
  selector: 'app-scoreboard-page',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './scoreboard-page.component.html',
  styleUrl: './scoreboard-page.component.css',
  providers: [WebsocketService]
})
export class ScoreboardPageComponent {
  players: Player[] = [];
  passcode = "";
  username = null;

  constructor(private router: Router, private route: ActivatedRoute, private websocketService: WebsocketService) {
    this.passcode = this.route.snapshot.paramMap.get('passcode')!;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
    })

    this.websocketService.connect();

    this.websocketService.subscribe(`/topic/${this.passcode}/players`, (playersMessage) => {
      this.players = JSON.parse(playersMessage.body);
    });

    this.websocketService.sendMessage(`/app/${this.passcode}/players`, "");
  }

  exitBtnType = EButtonType.DANGER;
  exitBtnLabel = "Exit";
  onExit() {
    const destination = this.username ? this.username + '/dashboard' : '';
    this.router.navigate([destination]);
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
