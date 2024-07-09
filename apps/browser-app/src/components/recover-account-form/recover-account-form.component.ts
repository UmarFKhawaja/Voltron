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
import { Result } from '@voltron/common-library';
import { Observable } from 'rxjs';
import { constants } from '../../app/app.constants';
import { RouteService } from '../../services/route/route.service';
import { SnackService } from '../../services/snack/snack.service';
import { UserService } from '../../services/user/user.service';
import { DividerComponent } from '../divider/divider.component';

@Component({
  selector: 'app-recover-account-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    DividerComponent
  ],
  templateUrl: './recover-account-form.component.html',
  styleUrl: './recover-account-form.component.scss'
})
export class RecoverAccountFormComponent {
  private readonly _formGroup: FormGroup;

  constructor(
    private readonly routeService: RouteService,
    private readonly snackService: SnackService,
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
      ])
    });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  async onSubmit(): Promise<void> {
    const {
      username
    } = this._formGroup.value;

    const response: Observable<Result<void>> = await this.userService.recoverAccount(username);

    response.subscribe({
      next: async (result: Result<void>): Promise<void> => {
        if (result.success) {
          await this.routeService.navigate(['app', 'show-message', constants.CODES.RECOVER_ACCOUNT.CONFIRM], {});
        } else {
          await this.snackService.showSnack(constants.MESSAGES.RECOVER_ACCOUNT.CHECK, 'OK');
        }
      },
      error: async (error: unknown): Promise<void> => {
        await this.snackService.showSnack(constants.MESSAGES.GENERAL.TRY_LATER, 'OK');
      }
    });
  }
}
