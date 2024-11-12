import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { EButtonType } from '../button/EButtonType';
import { Question } from '../dtos/question-dto';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormControl } from '@angular/forms';
import { Option } from '../dtos/option-dto';

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
  options: Option[] = [{ phrasing: "example", correctAnswer: false }];
  handleAddOption() {
    this.options.push({ phrasing: '', correctAnswer: false });
  }
  deleteOptionBtnType = EButtonType.DANGER;
  deleteOptionBtnLabel = "X"
  handleDeleteOption(index: number) {
    this.options.splice(index, 1);
  }
  handleToggleOptionCorrect(index: number) {
    this.options[index].correctAnswer = !this.options[index].correctAnswer;
  }

  cancelBtnType = EButtonType.CANCEL;
  cancelBtnLabel = "Cancel";
  closeModal() {
    this.phrasing = new FormControl("");
    this.options = [];
    this.isVisible = false;
    this.close.emit();
  }

  addBtnType = EButtonType.CONFIRM;
  addBtnLabel = "Add";
  handleAdd() {
    if (!this.phrasing.value || this.options.length < 2) return;
    const question: Question = {
      phrasing: this.phrasing.value,
      options: this.options
    }
    this.add.emit(question);
    this.closeModal();
  }

}
