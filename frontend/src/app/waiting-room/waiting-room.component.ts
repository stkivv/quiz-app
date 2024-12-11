import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { Player } from '../dtos/player-dto';
import { GameService } from '../game.service';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.css',
  providers: [WebsocketService, GameService]
})

export class WaitingRoomComponent {
  name = "";
  passcode = "";
  players = [] as Player[];

  constructor(private router: Router, private route: ActivatedRoute, private gameService: GameService) { }

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('playername')!;
    this.passcode = this.route.snapshot.paramMap.get('passcode')!;

    this.gameService.connectToWebsocket(this.passcode);

    this.gameService.subscribeToPlayerList((players: Player[]) => {
      this.players = players
    });

    this.gameService.subscribeToGameStartEvent(() => {
      this.router.navigate([`${this.name}/game/${this.passcode}/player`]);
    });

    this.gameService.getPlayers();
  }

  ngOnDestroy(): void {
    this.gameService.disconnectFromWebsocket();
  }
}
