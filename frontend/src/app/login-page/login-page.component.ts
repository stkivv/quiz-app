import { Component } from '@angular/core';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';
import { ButtonComponent } from '../button/button.component';
import { BackendService } from '../backend.service';
import { userDto } from '../dtos/user-dto';
import { PageBgSmallComponent } from '../page-bg-small/page-bg-small.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormInputComponent, ButtonComponent, PageBgSmallComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  constructor(private backendService: BackendService, private router: Router) { }

  username = new FormControl('');
  password = new FormControl('');

  submitBtnType = EButtonType.CONFIRM;
  submitBtnLabel = "Log in";
  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Back";

  handleCancelClick() {
    this.router.navigate([''])
  }

  submitForm() {
    if (!this.username.value || !this.password.value) return;
    const url = "auth/login";
    const user: userDto = {
      username: this.username.value,
      password: this.password.value
    }
    this.backendService.doPost<string>(url, user, "text").subscribe({
      next: (response: string) => {
        console.log(response)
        this.router.navigate([`${user.username}/dashboard`])
      },
      error: (error: any) => {
        console.error("Error: ", error)
      }
    });
  }
}
