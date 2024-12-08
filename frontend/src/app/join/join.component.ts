import { Component } from '@angular/core';
import { FormInputComponent } from '../form-input/form-input.component';
import { ButtonComponent } from '../button/button.component';
import { FormControl } from '@angular/forms';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [FormInputComponent, ButtonComponent],
  templateUrl: './join.component.html',
  styleUrl: './join.component.css',
  providers: [WebsocketService]
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

    this.websocketService.subscribe(`/topic/${this.passcode.value}/players`, () => {
      this.router.navigate([`${this.name.value}/waitingroom/${this.passcode.value}`]);
    });

    this.websocketService.sendMessage(`/app/${this.passcode.value}/join`, this.name.value);
  }

  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Back";
  handleCancel() {
    this.router.navigate([''])
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
