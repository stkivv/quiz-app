import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { userDto } from '../dtos/user-dto';
import { FormInputComponent } from '../form-input/form-input.component';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { PageBgSmallComponent } from '../page-bg-small/page-bg-small.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormInputComponent,
    ButtonComponent,
    PageBgSmallComponent,
    ReactiveFormsModule,
    NotificationComponent
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  registerForm: FormGroup;
  @ViewChild('error') errorNotification!: NotificationComponent;
  @ViewChild('success') successNotification!: NotificationComponent;

  constructor(private backendService: BackendService, private router: Router, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
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
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]),
    });

    this.registerForm.addValidators(this.passwordsMatchValidator)
  }

  passwordsMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  submitBtnType: EButtonType = EButtonType.CONFIRM;
  submitBtnLabel = 'Sign up'
  cancelBtnType: EButtonType = EButtonType.CANCEL;
  cancelBtnLabel = 'Cancel'

  handleCancelClick() {
    this.router.navigate([''])
  }

  submitForm() {
    if (!this.registerForm.valid) {
      this.errorNotification.showMessage("Something went wrong. Please ensure both passwords are typed correctly.");
      return;
    }

    const url = "auth/register"
    const user: userDto = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value
    }

    this.backendService.doPost(url, user, "text").subscribe({
      next: (response: any) => {
        console.log(response);
        this.successNotification.showMessage("Account created!");

        // after succesfully registering, attempt log in
        const loginUrl = "auth/login"
        this.backendService.doPost(loginUrl, user, "text").subscribe({
          next: () => {
            this.router.navigate([`${user.username}/dashboard`])
          }
        });
      },
      error: (error: any) => {
        console.error(error);
        this.errorNotification.showMessage("Something went wrong. Username is possibly already taken.");
      }
    })
  }

}
