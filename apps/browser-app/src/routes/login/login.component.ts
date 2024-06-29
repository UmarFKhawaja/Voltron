import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formGroup: FormGroup;

  constructor(
    private readonly userService: UserService
  ) {
    this.formGroup = new FormGroup({
      username: new FormControl('', (control: AbstractControl) => {
        const errors: Record<string, ValidationErrors | null> = {
          email: Validators.email(control),
          username: Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_.]+$/)(control)
        };

        const isValid: boolean = errors['email'] == null || errors['username'] == null;

        return isValid
          ? null
          : {
            invalid: 'Email address or user name must be provided'
          };
      }),
      password: new FormControl('', Validators.required)
    });
  }

  async onSubmit() {
    const {
      username,
      password
    } = this.formGroup.value;

    await this.userService.login(username, password)
  }
}
