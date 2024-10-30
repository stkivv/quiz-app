import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

export const routes: Routes = [{ path: '', component: LandingPageComponent }, { path: 'register', component: RegisterPageComponent }];

