import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LabelComponent } from '../label/label.component';
import { TitleComponent } from '../title/title.component';

@Component({
  selector: 'app-warning-message',
  standalone: true,
  imports: [
    CommonModule,
    LabelComponent,
    TitleComponent
  ],
  templateUrl: './warning-message.component.html',
  styleUrl: './warning-message.component.scss'
})
export class WarningMessageComponent {
}
