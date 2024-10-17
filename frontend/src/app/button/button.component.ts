import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EButtonType } from './EButtonType';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() btnType: EButtonType = EButtonType.CONFIRM;
  @Input() btnLabel: string = 'Submit';
  @Output() onClickAction = new EventEmitter<void>();

  get btnClass(): string {
    return this.btnType + '-btn';
  }

  onClick() {
    this.onClickAction.emit();
  }
}
