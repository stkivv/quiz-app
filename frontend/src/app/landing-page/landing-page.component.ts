import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  constructor(private router: Router) { }

  btnType: EButtonType = EButtonType.MENU

  joinBtnLabel: string = 'Join game';
  handleJoinBtnClick() {
  }

  loginBtnLabel: string = 'Log in';
  handleLoginBtnClick() {
    this.router.navigate(['login'])
  }

  registerBtnLabel: string = 'Sign up';
  handleRegisterButtonClick() {
    this.router.navigate(['register']);
  }
}

