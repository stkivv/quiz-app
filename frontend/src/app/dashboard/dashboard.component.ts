import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../dtos/quiz-dto';
import { BackendService } from '../backend.service';
import { PageBgComponent } from '../page-bg/page-bg.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent, PageBgComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  username: string = "";
  quizzes: Quiz[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private backendService: BackendService) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.getQuizzes();
  }

  getQuizzes() {
    const url = "quiz";
    this.backendService.doGet<Quiz[]>(url, 'json').subscribe(quizzes => {
      this.quizzes = quizzes;
    });
  }

  getQuizEditedTime(time: string | undefined | Date): string {
    if (!time) return "";
    const date: Date = new Date(time);
    return date.toLocaleDateString();
  }

  logOutBtnType = EButtonType.MENU;
  logOutBtnLabel = "Log out";
  handleLogOut() {
    this.router.navigate([''])
  }
  newQuizBtnType = EButtonType.CONFIRM;
  newQuizBtnLabel = "Create new +";
  handleNewQuiz() {
    this.router.navigate([`${this.username}/create`]);
  }

  hostBtnType = EButtonType.CONFIRM;
  hostBtnLabel = "Host"
  handleHostQuiz(quiz: Quiz) {
    this.router.navigate([`${this.username}/lobby/${quiz.id}`]);
  }

  editBtnType = EButtonType.NEUTRAL;
  editBtnLabel = "Edit"
  handleEditQuiz(quiz: Quiz) {
    this.router.navigate([`${this.username}/create/${quiz.id}`])
  }

  deleteBtnType = EButtonType.DANGER;
  deleteBtnLabel = "Delete"
  handleDeleteQuiz(quiz: Quiz) {
    const url = "quiz/" + quiz.id;
    this.backendService.doDelete<string>(url, 'text').subscribe(r => {
      this.getQuizzes();
    })
  }
}
