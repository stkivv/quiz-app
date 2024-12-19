import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Question } from '../dtos/question-dto';
import { FormInputComponent } from '../form-input/form-input.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-add-question-modal',
  standalone: true,
  imports: [
    ButtonComponent,
    FormInputComponent,
    ReactiveFormsModule,
    NotificationComponent
  ],
  templateUrl: './add-question-modal.component.html',
  styleUrl: './add-question-modal.component.css'
})
export class AddQuestionModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<Question>();

  alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  questionForm: FormGroup;

  @ViewChild(NotificationComponent) notification!: NotificationComponent;

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      phrasing: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      options: this.fb.array([], [Validators.required, Validators.minLength(2)])
    })

    this.questionForm.setValidators(this.optionsValidator);
  }

  optionsValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const options = group.get('options') as FormArray;

    if (!options || options.length < 2) {
      return { insufficientOptions: true }
    }

    const correctAnswersCount = options.controls.filter(
      (control) => control.get('correctAnswer')?.value === true
    ).length;

    if (correctAnswersCount !== 1) {
      return { incorrectCorrectAnswerCount: true };
    }

    return null;
  }

  get optionArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  handleAddOption() {
    const optionGroup = this.fb.group({
      phrasing: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      correctAnswer: new FormControl(false, [Validators.required])
    })
    this.optionArray.push(optionGroup);
  }

  addBtnType = EButtonType.CONFIRM;
  addBtnLabel = "Add";
  handleAdd() {
    if (!this.questionForm.valid) {
      this.notification.showMessage("Could not add the question. There can only be one right answer and there needs to be at least two answer options.");
      return;
    };

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
    const optionControl = this.optionArray.at(index);
    const currentValue = optionControl.get('correctAnswer')?.value;
    optionControl.get('correctAnswer')?.setValue(!currentValue);
  }
}
