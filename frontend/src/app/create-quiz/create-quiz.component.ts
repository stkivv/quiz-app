import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { ActivatedRoute, Router } from '@angular/router';
import { AddQuestionModalComponent } from '../add-question-modal/add-question-modal.component';
import { Question } from '../dtos/question-dto';
import { BackendService } from '../backend.service';
import { Quiz } from '../dtos/quiz-dto';
import { FormControl } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [ButtonComponent, AddQuestionModalComponent, FormInputComponent],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  username: string = "";
  questions: Question[] = [];
  alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor(private router: Router, private route: ActivatedRoute, private backendService: BackendService) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  title = new FormControl("");
  description = new FormControl("");

  addQuestionBtnType = EButtonType.CONFIRM;
  addQuestionLabel = "Add new question +"
  showQuestionModal = false;
  addQuestion(question: Question) {
    this.questions.push(question);
  }

  saveQuizBtnType = EButtonType.CONFIRM;
  saveQuizLabel = "Save";
  submitForm() {
    if (this.questions.length < 1) return;
    const url = "quiz";
    const quiz: Quiz = {
      title: this.title.value ? this.title.value : "Untitled",
      description: this.description.value ? this.description.value : "No description",
      publicQuiz: false,
      passCode: "123ABC",
      lastEdit: new Date(),
      questions: this.questions
    }

    this.backendService.doPost<string>(url, quiz, "text").subscribe({
      next: (response: string) => {
        console.log(response)
        this.router.navigate([`${this.username}/dashboard`]);
      },
      error: (error: any) => {
        console.error("Error: ", error)
      }
    });
  }

  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Cancel";
  handleCancel() {
    this.router.navigate([`${this.username}/dashboard`]);
  }

}
