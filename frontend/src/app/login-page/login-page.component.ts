import { Component, ViewChild } from '@angular/core';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';
import { ButtonComponent } from '../button/button.component';
import { BackendService } from '../backend.service';
import { userDto } from '../dtos/user-dto';
import { PageBgSmallComponent } from '../page-bg-small/page-bg-small.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormInputComponent,
    ButtonComponent,
    PageBgSmallComponent,
    ReactiveFormsModule,
    NotificationComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loginForm: FormGroup;
  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  constructor(private backendService: BackendService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]),
    })
  }

  submitBtnType = EButtonType.CONFIRM;
  submitBtnLabel = "Log in";
  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Back";

  handleCancelClick() {
    this.router.navigate([''])
  }

  submitForm() {
    if (!this.loginForm.valid) {
      this.notification.showMessage("Cannot log in. Username or password is possibly incorrect");
      return;
    };

    const url = "auth/login";
    const user: userDto = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    }
    this.backendService.doPost<string>(url, user, "text").subscribe({
      next: (response: string) => {
        console.log(response)
        this.router.navigate([`${user.username}/dashboard`])
      },
      error: (error: any) => {
        this.notification.showMessage("Cannot log in. Username or password is possibly incorrect");
      }
    });
  }
}
