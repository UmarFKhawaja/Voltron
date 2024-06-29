import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  formGroup: FormGroup = new FormGroup({
    emailAddress: new FormControl('', Validators.email),
    userName: new FormControl('', Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_.]+$/)),
    password: new FormControl('', Validators.required)
  });

  onSubmit() {
    console.log(this.formGroup.value);
  }
}
