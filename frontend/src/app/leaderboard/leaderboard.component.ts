import { Component, Input } from '@angular/core';
import { Player } from '../dtos/player-dto';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent {
  @Input() players: Player[] = [];
}
