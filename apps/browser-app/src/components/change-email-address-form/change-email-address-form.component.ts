import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-email-address-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './change-email-address-form.component.html',
  styleUrl: './change-email-address-form.component.scss'
})
export class ChangeEmailAddressFormComponent {
}
