import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Question } from '../dtos/question-dto';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question-modal',
  standalone: true,
  imports: [ButtonComponent, FormInputComponent, ReactiveFormsModule],
  templateUrl: './add-question-modal.component.html',
  styleUrl: './add-question-modal.component.css'
})
export class AddQuestionModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<Question>();

  alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  questionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      phrasing: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      options: this.fb.array([], [Validators.required, Validators.minLength(2)])
    })
  }

  get optionArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  handleAddOption() {
    const option = new FormGroup({ phrasing: new FormControl(""), correctAnswer: new FormControl(false) });
    this.optionArray.push(option);
  }

  addBtnType = EButtonType.CONFIRM;
  addBtnLabel = "Add";
  handleAdd() {
    if (!this.questionForm.valid) return;

    const question: Question = {
      phrasing: this.questionForm.get('phrasing')?.value,
      options: this.questionForm.get('options')?.value
    }
    this.add.emit(question);
    this.closeModal();
  }

  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Cancel";
  closeModal() {
    this.questionForm.get('phrasing')?.setValue('');
    this.optionArray.clear();
    this.isVisible = false;
    this.close.emit();
  }

  handleDeleteOption(index: number) {
    this.optionArray.removeAt(index);
  }

  handleToggleOptionCorrect(index: number) {
    this.optionArray.value[index].correctAnswer = !this.optionArray.value[index].correctAnswer;
  }
}
