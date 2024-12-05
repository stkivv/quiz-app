import { Component } from '@angular/core';
import { FormInputComponent } from '../form-input/form-input.component';
import { ButtonComponent } from '../button/button.component';
import { FormControl } from '@angular/forms';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { Player } from '../dtos/player-dto';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [FormInputComponent, ButtonComponent],
  templateUrl: './join.component.html',
  styleUrl: './join.component.css'
})
export class JoinComponent {
  constructor(private router: Router, private websocketService: WebsocketService) { }

  name = new FormControl('');
  passcode = new FormControl('');

  submitBtnType = EButtonType.CONFIRM;
  submitBtnLabel = "Join";
  handleJoin() {
    if (!this.name.value || !this.passcode.value || this.passcode.value.length !== 6) return;

    this.websocketService.connect();

    this.websocketService.subscribe(`/topic/${this.passcode.value}/players`, (playersMessage) => {
      const players: Player[] = JSON.parse(playersMessage.body);
    });

    this.websocketService.sendMessage(`/app/${this.passcode.value}/join`, this.name.value);
  }


  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Back";
  handleCancel() {
    this.router.navigate([''])
  }
}
