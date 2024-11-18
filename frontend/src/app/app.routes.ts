import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: ':username/dashboard', component: DashboardComponent },
  {
    path: ':username/create', component: CreateQuizComponent, children: [

      { path: ':quizid', component: CreateQuizComponent }
    ]
  },
];

