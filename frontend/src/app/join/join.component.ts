import { Component, ViewChild } from '@angular/core';
import { FormInputComponent } from '../form-input/form-input.component';
import { ButtonComponent } from '../button/button.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';
import { WebsocketService } from '../websocket.service';
import { GameService } from '../game.service';
import { PageBgSmallComponent } from '../page-bg-small/page-bg-small.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [
    FormInputComponent,
    ButtonComponent,
    PageBgSmallComponent,
    ReactiveFormsModule,
    NotificationComponent
  ],
  templateUrl: './join.component.html',
  styleUrl: './join.component.css',
  providers: [WebsocketService, GameService]
})
export class JoinComponent {
  joinForm: FormGroup;
  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  constructor(private router: Router, private gameService: GameService, private fb: FormBuilder) {
    this.joinForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ]),
      passcode: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ]),
    })
  }

  submitBtnType = EButtonType.CONFIRM;
  submitBtnLabel = "Join";
  handleJoin() {
    if (!this.joinForm.valid) {
      this.notification.showMessage("Unable to join. Name cannot be longer than 20 characters and the passcode must be exactly 4 characters.")
      return;
    };
    const passcode = this.joinForm.get('passcode')?.value;
    const name = this.joinForm.get('name')?.value;

    this.gameService.connectToWebsocket(passcode);

    this.gameService.subscribeToPlayerList(() => {
      this.router.navigate([`${name}/waitingroom/${passcode}`]);
    });

    this.gameService.joinGame(name);
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
