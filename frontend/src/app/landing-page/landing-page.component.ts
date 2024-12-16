import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';
import { PageBgSmallComponent } from '../page-bg-small/page-bg-small.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ButtonComponent, PageBgSmallComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  constructor(private router: Router) { }

  btnType: EButtonType = EButtonType.MENU

  joinBtnLabel: string = 'Join game';
  handleJoinBtnClick() {
    this.router.navigate(['join']);
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

