import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { GameLobbyComponent } from './game-lobby/game-lobby.component';
import { JoinComponent } from './join/join.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { HostGameComponent } from './host-game/host-game.component';

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
  {
    path: ':username/lobby', component: GameLobbyComponent, children: [
      { path: ':quizid', component: GameLobbyComponent }
    ]
  },
  { path: 'join', component: JoinComponent },
  { path: ':playername/waitingroom/:passcode', component: WaitingRoomComponent },
  { path: ':username/game/:passcode/host', component: HostGameComponent },
];

