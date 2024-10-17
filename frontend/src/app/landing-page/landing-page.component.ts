import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  btnType: EButtonType = EButtonType.MENU

  joinBtnLabel: string = 'Join game';
  handleJoinBtnClick() {
  }

  loginBtnLabel: string = 'Log in';
  handleLoginBtnClick() {
  }

  registerBtnLabel: string = 'Register';
  handleRegisterButtonClick() {
  }
}
