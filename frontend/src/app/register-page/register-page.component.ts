import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [FormInputComponent, ButtonComponent, PageBgSmallComponent, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  registerForm: FormGroup;
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
    })
  }

  submitBtnType: EButtonType = EButtonType.CONFIRM;
  submitBtnLabel = 'Sign up'
  cancelBtnType: EButtonType = EButtonType.CANCEL;
  cancelBtnLabel = 'Cancel'

  handleCancelClick() {
    this.router.navigate([''])
  }

  submitForm() {
    if (!this.registerForm.valid) return;

    const url = "auth/register"
    const user: userDto = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value
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
