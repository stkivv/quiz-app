import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) { }

  logOutBtnType = EButtonType.MENU;
  logOutBtnLabel = "Log out";
  handleLogOut() {
    this.router.navigate([''])
  }
  newQuizBtnType = EButtonType.CONFIRM;
  newQuizBtnLabel = "Create new";
  handleNewQuiz() {
  }

  playBtnType = EButtonType.CONFIRM;
  playBtnLabel = "Host"
  handlePlayQuiz() {
  }

  editBtnType = EButtonType.NEUTRAL;
  editBtnLabel = "Edit"
  handleEditQuiz() {
  }

  deleteBtnType = EButtonType.DANGER;
  deleteBtnLabel = "Delete"
  handleDeleteQuiz() {
  }
}
