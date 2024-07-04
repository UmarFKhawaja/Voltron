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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Result, Token } from '@voltron/common-library';
import { catchError, Observable, of, tap } from 'rxjs';
import { constants } from '../../app/app.constants';
import { RouteService } from '../../services/route/route.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  private readonly _formGroup: FormGroup;

  constructor(
    private readonly routeService: RouteService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    this._formGroup = new FormGroup({
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

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  async onSubmit(): Promise<void> {
    const {
      username,
      password
    } = this._formGroup.value;

    if (password) {
      const result: Observable<Result<Token>> = await this.userService.loginWithPassword(username, password);

      result
        .pipe(
          tap((result: Result<Token>): void => {
            if (result.success) {
              const { access_token: accessToken } = result.data;

              this.tokenService.saveToken(accessToken);
            }
          }),
          catchError((error: unknown) => of<Result<Token>>({
            success: false,
            error: error as Error
          }))
        )
        .subscribe(async (result: Result<Token>): Promise<void> => {
          if (result.success) {
            await this.routeService.navigate([''], {});
          } else {
            await this.routeService.navigate(['app', 'show-message', constants.MESSAGES.LOGIN.PASSWORD.CHECK], {});
          }
        });
    } else {
      const result: Observable<Result<void>> = await this.userService.loginWithMagicLogin(username);

      result
        .subscribe(async (result: Result<void>): Promise<void> => {
          if (result.success) {
            await this.routeService.navigate(['app', 'show-message', constants.MESSAGES.LOGIN.MAGIC_LOGIN.CONFIRM], {});
          } else {
            await this.routeService.navigate(['app', 'show-message', constants.MESSAGES.LOGIN.MAGIC_LOGIN.CHECK], {});
          }
        });
    }
  }
}
