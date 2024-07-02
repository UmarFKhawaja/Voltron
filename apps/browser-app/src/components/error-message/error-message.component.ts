import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LabelComponent } from '../label/label.component';
import { TitleComponent } from '../title/title.component';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, LabelComponent, TitleComponent],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {
}
