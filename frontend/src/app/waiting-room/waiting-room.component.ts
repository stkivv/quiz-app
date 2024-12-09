import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { Player } from '../dtos/player-dto';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.css',
  providers: [WebsocketService]
})

export class WaitingRoomComponent {
  name = "";
  passcode = "";
  players = [] as Player[];

  constructor(private router: Router, private route: ActivatedRoute, private websocketService: WebsocketService) { }

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('playername')!;
    this.passcode = this.route.snapshot.paramMap.get('passcode')!;

    this.websocketService.connect();

    this.websocketService.subscribe(`/topic/${this.passcode}/players`, (playersMessage) => {
      this.players = JSON.parse(playersMessage.body);
    });

    this.websocketService.subscribe(`/topic/${this.passcode}/start`, () => {
      this.router.navigate([`${this.name}/game/${this.passcode}/player`]);
    });

    this.websocketService.sendMessage(`/app/${this.passcode}/players`, "");
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
