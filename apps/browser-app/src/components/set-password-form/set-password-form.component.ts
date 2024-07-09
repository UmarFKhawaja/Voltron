import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Result, Token } from '@voltron/common-library';
import { Observable } from 'rxjs';
import { constants } from '../../app/app.constants';
import { RouteService } from '../../services/route/route.service';
import { SnackService } from '../../services/snack/snack.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-set-password-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './set-password-form.component.html',
  styleUrl: './set-password-form.component.scss'
})
export class SetPasswordFormComponent {
  private readonly _formGroup: FormGroup;

  constructor(
    private readonly routeService: RouteService,
    private readonly snackService: SnackService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    this._formGroup = new FormGroup({
      newPassword: new FormControl('', Validators.required)
    });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  async onSubmit(): Promise<void> {
    const token: string = this.tokenService.token;

    const {
      newPassword
    } = this._formGroup.value;

    const response: Observable<Result<Token>> = await this.userService.setPassword(token, newPassword);

    response.subscribe({
      next: async (result: Result<Token>): Promise<void> => {
        if (result.success) {
          this.tokenService.saveToken(result.data.token);

          await this.routeService.navigate(['app', 'show-message', constants.CODES.SET_PASSWORD.CONFIRM], {});
        } else {
          await this.snackService.showSnack(constants.MESSAGES.SET_PASSWORD.CHECK, 'OK');
        }
      },
      error: async (error: unknown): Promise<void> => {
        await this.snackService.showSnack(constants.MESSAGES.GENERAL.TRY_LATER, 'OK');
      }
    });
  }
}
