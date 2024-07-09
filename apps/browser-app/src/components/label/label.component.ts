import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss'
})
export class LabelComponent {
}
