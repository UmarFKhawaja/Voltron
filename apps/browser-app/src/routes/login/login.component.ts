import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { Observable } from 'rxjs';
import { RouteClient } from '../../clients/route.client';
import { MESSAGES } from '../../constants';
import { RouteService } from '../../services/route/route.service';
import { UserService } from '../../services/user/user.service';
import { Result, Token } from '@voltron/common-library';

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
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formGroup: FormGroup;

  constructor(
    private readonly userService: UserService,
    private readonly routeService: RouteService
  ) {
    this.formGroup = new FormGroup({
      username: new FormControl('', [
        (control: AbstractControl) => {
          const errors: Record<string, ValidationErrors | null> = {
            email: Validators.email(control),
            username: Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_.]*$/)(control)
          };

          const isValid: boolean = errors['email'] == null || errors['username'] == null;

          return isValid
            ? null
            : {
              invalid: 'Email address or user name must be provided'
            };
        },
        Validators.required
      ]),
      password: new FormControl('')
    });
  }

  async onSubmit() {
    const {
      username,
      password
    } = this.formGroup.value;

    if (password) {
      const result: Observable<Result<Token>> = await this.userService.loginWithPassword(username, password);

      result
        .subscribe(async (result: Result<Token>): Promise<void> => {
          if (result.success) {
            await this.routeService.navigate([''], {});
          } else {
            await this.routeService.navigate(['app', 'show-message', MESSAGES.LOGIN.PASSWORD.CHECK_AUTHENTICATION], {});
          }
        });
    } else {
      const result: Observable<Result<void>> = await this.userService.loginWithMagicLogin(username);

      result
        .subscribe(async (result: Result<void>): Promise<void> => {
          if (result.success) {
            await this.routeService.navigate(['app', 'show-message', MESSAGES.LOGIN.MAGIC_LOGIN.CONFIRM_AUTHENTICATION], {});
          } else {
            await this.routeService.navigate(['app', 'show-message', MESSAGES.LOGIN.MAGIC_LOGIN.CHECK_AUTHENTICATION], {});
          }
        });
    }
  }
}
