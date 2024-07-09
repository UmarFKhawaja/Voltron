import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-holder',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './holder.component.html',
  styleUrl: './holder.component.scss'
})
export class HolderComponent {
}
