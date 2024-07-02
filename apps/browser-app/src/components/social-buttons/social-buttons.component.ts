import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-social-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './social-buttons.component.html',
  styleUrl: './social-buttons.component.scss'
})
export class SocialButtonsComponent {
}
