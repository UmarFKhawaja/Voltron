import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Result, Token } from '@voltron/common-library';
import { Observable } from 'rxjs';
import { constants } from '../../app/app.constants';
import { SnackService } from '../../services/snack/snack.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-update-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './update-profile-form.component.html',
  styleUrl: './update-profile-form.component.scss'
})
export class UpdateProfileFormComponent {
  private readonly _formGroup: FormGroup;

  constructor(
    private readonly snackService: SnackService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    const displayName: string = this.tokenService.session?.displayName || '';
    const userName: string = this.tokenService.session?.userName || '';

    this._formGroup = new FormGroup({
      displayName: new FormControl(displayName, Validators.required),
      userName: new FormControl(userName, Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_.]+$/))
    });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  async onSubmit(): Promise<void> {
    const token: string = this.tokenService.token;

    const {
      displayName,
      userName
    } = this._formGroup.value;

    const response: Observable<Result<Token>> = await this.userService.updateProfile(token, displayName, userName);

    response.subscribe({
      next: async (result: Result<Token>): Promise<void> => {
        if (result.success) {
          this.tokenService.saveToken(result.data.token);
        } else {
          await this.snackService.showSnack(constants.MESSAGES.UPDATE_PROFILE.CHECK, 'OK');
        }
      },
      error: async (error: unknown): Promise<void> => {
        await this.snackService.showSnack(constants.MESSAGES.GENERAL.TRY_LATER, 'OK');
      }
    });
  }
}
