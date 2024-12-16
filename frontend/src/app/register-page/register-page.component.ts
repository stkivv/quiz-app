import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { userDto } from '../dtos/user-dto';
import { FormInputComponent } from '../form-input/form-input.component';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { PageBgSmallComponent } from '../page-bg-small/page-bg-small.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormInputComponent, ButtonComponent, PageBgSmallComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  constructor(private backendService: BackendService, private router: Router) { }

  username = new FormControl('');
  password = new FormControl('');
  confirmPassword = new FormControl('');

  submitBtnType: EButtonType = EButtonType.CONFIRM;
  submitBtnLabel = 'Sign up'
  cancelBtnType: EButtonType = EButtonType.CANCEL;
  cancelBtnLabel = 'Cancel'

  handleCancelClick() {
    this.router.navigate([''])
  }

  submitForm() {
    if (!this.password.value ||
      this.password.value !== this.confirmPassword.value) return;
    if (!this.username.value) return;

    const url = "auth/register"
    const user: userDto = {
      username: this.username.value,
      password: this.password.value
    }

    this.backendService.doPost(url, user, "text").subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.error("Error: ", error)
      }
    })
  }

}
