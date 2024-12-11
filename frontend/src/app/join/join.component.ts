import { Component } from '@angular/core';
import { FormInputComponent } from '../form-input/form-input.component';
import { ButtonComponent } from '../button/button.component';
import { FormControl } from '@angular/forms';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [FormInputComponent, ButtonComponent],
  templateUrl: './join.component.html',
  styleUrl: './join.component.css',
  providers: [WebsocketService, GameService]
})
export class JoinComponent {
  constructor(private router: Router, private gameService: GameService) { }

  name = new FormControl('');
  passcode = new FormControl('');

  submitBtnType = EButtonType.CONFIRM;
  submitBtnLabel = "Join";
  handleJoin() {
    if (!this.name.value || !this.passcode.value || this.passcode.value.length !== 6) return;

    this.gameService.connectToWebsocket(this.passcode.value);

    this.gameService.subscribeToPlayerList(() => {
      this.router.navigate([`${this.name.value}/waitingroom/${this.passcode.value}`]);
    });

    this.gameService.joinGame(this.name.value);
  }

  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Back";
  handleCancel() {
    this.router.navigate([''])
  }

  ngOnDestroy(): void {
    this.gameService.disconnectFromWebsocket();
  }
}
