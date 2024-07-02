import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule, MatDivider],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss'
})
export class DividerComponent {
}
