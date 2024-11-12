import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { ActivatedRoute, Router } from '@angular/router';
import { AddQuestionModalComponent } from '../add-question-modal/add-question-modal.component';
import { Question } from '../dtos/question-dto';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [ButtonComponent, AddQuestionModalComponent],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  username: string = "";
  questions: Question[] = [];
  alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
    const example: Question = {
      phrasing: "What color is the sky?",
      options: [
        { phrasing: "red", correctAnswer: false },
        { phrasing: "blue", correctAnswer: true },
        { phrasing: "magenta", correctAnswer: false },
        { phrasing: "green", correctAnswer: false }
      ]
    };
    this.questions.push(example);
  }


  addQuestionBtnType = EButtonType.CONFIRM;
  addQuestionLabel = "Add new question +"
  showQuestionModal = true;
  addQuestion(question: Question) {
    this.questions.push(question);
  }

  saveQuizBtnType = EButtonType.CONFIRM;
  saveQuizLabel = "Save";
  handleSaveQuiz() { }

  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Cancel";
  handleCancel() {
    this.router.navigate([`${this.username}/dashboard`]);
  }

}
