import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../dtos/player-dto';
import { EButtonType } from '../button/EButtonType';
import { GameService } from '../game.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { PageBgComponent } from '../page-bg/page-bg.component';

@Component({
  selector: 'app-scoreboard-page',
  standalone: true,
  imports: [ButtonComponent, LeaderboardComponent, PageBgComponent],
  templateUrl: './scoreboard-page.component.html',
  styleUrl: './scoreboard-page.component.css',
  providers: [WebsocketService, GameService]
})
export class ScoreboardPageComponent {
  players: Player[] = [];
  passcode = "";
  username = null;

  constructor(private router: Router, private route: ActivatedRoute, private gameService: GameService) {
    this.passcode = this.route.snapshot.paramMap.get('passcode')!;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
    })

    this.gameService.connectToWebsocket(this.passcode);

    this.gameService.subscribeToPlayerList((players: Player[]) => {
      this.players = players;
    });

    this.gameService.getPlayers();
  }

  exitBtnType = EButtonType.DANGER;
  exitBtnLabel = "Exit";
  onExit() {
    const destination = this.username ? this.username + '/dashboard' : '';
    this.router.navigate([destination]);
  }

  ngOnDestroy(): void {
    this.gameService.disconnectFromWebsocket();
  }
}
