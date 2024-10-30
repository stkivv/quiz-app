import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { userDto } from '../dtos/user-dto';
import { FormInputComponent } from '../form-input/form-input.component';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormInputComponent, ButtonComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  constructor(private http: HttpClient, private router: Router) { }

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

    const url = environment.apiUrl + "auth/register"
    const user: userDto = {
      username: this.username.value,
      password: this.password.value
    }

    this.doPost(url, user)
  }

  private doPost(url: string, user: userDto) {
    this.http.post(url, user, { responseType: "text" }).subscribe({
      next: (response: any) => {
        console.log(response)
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }
}
