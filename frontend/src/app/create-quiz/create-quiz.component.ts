import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { ActivatedRoute, Router } from '@angular/router';
import { AddQuestionModalComponent } from '../add-question-modal/add-question-modal.component';
import { Question } from '../dtos/question-dto';
import { BackendService } from '../backend.service';
import { Quiz } from '../dtos/quiz-dto';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';
import { PageBgComponent } from '../page-bg/page-bg.component';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [ButtonComponent, AddQuestionModalComponent, FormInputComponent, PageBgComponent, ReactiveFormsModule],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  username: string = "";
  quizId: string | null = null;
  questions: Question[] = [];
  alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
  createForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private backendService: BackendService, private fb: FormBuilder) {
    this.createForm = this.fb.group({
      title: new FormControl('', [
        Validators.maxLength(30)
      ]),
      description: new FormControl('', [
        Validators.maxLength(30)
      ]),
    })
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
    const id = this.route.firstChild?.snapshot.paramMap.get('quizid');
    if (id) {
      const url = "quiz/" + id;
      this.backendService.doGet<Quiz>(url, 'json').subscribe(quiz => {
        this.quizId = quiz.id!;
        this.createForm.get('title')?.setValue(quiz.title);
        this.createForm.get('description')?.setValue(quiz.description);
        this.questions = quiz.questions;
      });
    }
  }

  moveQuestion(index: number, direction: 'forward' | 'back') {
    if (direction === 'back' && index === this.questions.length - 1
      || direction === 'forward' && index === 0) return;

    const value = this.questions[index]
    const swapIndex = direction === 'forward' ? index - 1 : index + 1;
    const swapValue = this.questions[swapIndex];
    this.questions[index] = swapValue;
    this.questions[swapIndex] = value;
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addQuestionBtnType = EButtonType.CONFIRM;
  addQuestionLabel = "Add new question +"
  showQuestionModal = false;
  addQuestion(question: Question) {
    this.questions.push(question);
  }

  saveQuizBtnType = EButtonType.CONFIRM;
  saveQuizLabel = "Save";
  submitForm() {
    if (!this.createForm.valid || this.questions.length < 1) return;

    const title = this.createForm.get('title')?.value;
    const description = this.createForm.get('description')?.value;

    const url = "quiz";
    const quiz: Quiz = {
      id: this.quizId ? this.quizId : "",
      title: title ? title : "Untitled",
      description: description ? description : "No description",
      publicQuiz: false,
      passCode: "",
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
