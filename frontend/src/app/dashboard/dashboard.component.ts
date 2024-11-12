import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  username: string = "";

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  logOutBtnType = EButtonType.MENU;
  logOutBtnLabel = "Log out";
  handleLogOut() {
    this.router.navigate([''])
  }
  newQuizBtnType = EButtonType.CONFIRM;
  newQuizBtnLabel = "Create new";
  handleNewQuiz() {
    this.router.navigate([`${this.username}/create`]);
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
