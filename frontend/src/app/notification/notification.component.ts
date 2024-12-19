import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgClass],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  protected message: string = '';
  protected visible: boolean = false;
  @Input() type: 'error' | 'success' = 'error';

  showMessage(message: string) {
    this.message = message;
    this.visible = true;
  }

  protected hide() {
    this.message = "";
    this.visible = false;
  }
}
