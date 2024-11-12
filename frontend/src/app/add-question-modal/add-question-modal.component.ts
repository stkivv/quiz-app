import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Question } from '../dtos/question-dto';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-question-modal',
  standalone: true,
  imports: [ButtonComponent, FormInputComponent],
  templateUrl: './add-question-modal.component.html',
  styleUrl: './add-question-modal.component.css'
})
export class AddQuestionModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<Question>();

  alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  phrasing = new FormControl("");
  options = new FormArray([] as FormGroup[]);
  handleAddOption() {
    const ctrl = new FormGroup({ phrasing: new FormControl(""), correctAnswer: new FormControl(false) });
    this.options.push(ctrl);
  }
  getPhrasingControl(option: FormGroup) {
    const phrasingControl = option.get('phrasing');
    if (phrasingControl instanceof FormControl) {
      return phrasingControl;
    } else {
      console.error("formGroup has the wrong format");
      return;
    }
  }

  addBtnType = EButtonType.CONFIRM;
  addBtnLabel = "Add";
  handleAdd() {
    if (!this.phrasing.value || this.options.length < 2) return;
    const question: Question = {
      phrasing: this.phrasing.value,
      options: this.options.value
    }
    this.add.emit(question);
    this.closeModal();
  }

  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Cancel";
  closeModal() {
    this.phrasing = new FormControl("");
    this.options = new FormArray([] as FormGroup[]);
    this.isVisible = false;
    this.close.emit();
  }

  deleteOptionBtnType = EButtonType.DANGER;
  deleteOptionBtnLabel = "X"
  handleDeleteOption(index: number) {
    this.options.removeAt(index);
  }

  handleToggleOptionCorrect(index: number) {
    this.options.value[index].correctAnswer = !this.options.value[index].correctAnswer;
  }
}
