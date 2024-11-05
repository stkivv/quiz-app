import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  addQuestionBtnType = EButtonType.CONFIRM;
  addQuestionLabel = "Add new question +"
  handleAddQuestion() { }


  saveQuizBtnType = EButtonType.CONFIRM;
  saveQuizLabel = "Save";
  handleSaveQuiz() { }

  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Cancel";
  handleCancel() { }
}
