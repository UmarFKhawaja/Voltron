import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { Information, Result } from '@voltron/common-library';
import { Observable } from 'rxjs';
import { SnackService } from '../../services/snack/snack.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';
import { DividerComponent } from '../divider/divider.component';

type Status =
  | 'NOT_STARTED'
  | 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED'
  | 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED';

@Component({
  selector: 'app-change-email-address-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    DividerComponent
  ],
  templateUrl: './change-email-address-form.component.html',
  styleUrl: './change-email-address-form.component.scss'
})
export class ChangeEmailAddressFormComponent implements OnInit {
  private readonly _formGroup: FormGroup;

  private _code: string;

  private _status: Status;

  constructor(
    private readonly snackService: SnackService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    const oldEmailAddress: string = this.tokenService.session?.emailAddress || '';

    this._formGroup = new FormGroup({
      oldEmailAddress: new FormControl(oldEmailAddress, [
        Validators.email,
        Validators.required
      ]),
      newEmailAddress: new FormControl('', [
        Validators.email,
        Validators.required
      ])
    });

    this._code = '';

    this._status = 'NOT_STARTED';
  }

  async ngOnInit(): Promise<void> {
    const token: string = this.tokenService.token;

    const response: Observable<Result<Information>> = await this.userService.getInformation(token);

    response.subscribe({
      next: this.handleNext.bind(this),
      error: this.handleError.bind(this)
    });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  get code(): string {
    return this._code;
  }

  get status(): Status {
    return this._status;
  }

  async onSubmit(): Promise<void> {
    const token: string = this.tokenService.token;

    const {
      newEmailAddress
    } = this._formGroup.value;

    const response: Observable<Result<Information>> = await this.userService.startEmailAddressChange(token, newEmailAddress);

    response.subscribe({
      next: this.handleNext.bind(this),
      error: this.handleError.bind(this)
    });
  }

  async onResendRequestLink(): Promise<void> {
    if (this.code) {
      const token: string = this.tokenService.token;

      const response: Observable<Result<Information>> = await this.userService.resendEmailAddressChange(token);

      response.subscribe({
        next: this.handleNext.bind(this),
        error: this.handleError.bind(this)
      });
    } else {
      await this.snackService.showSnack('Try resending the request after refreshing the page.', 'OK');
    }
  }

  async onCancelRequestLink(): Promise<void> {
    if (this.code) {
      const token: string = this.tokenService.token;

      const response: Observable<Result<Information>> = await this.userService.cancelEmailAddressChange(token, this.code);

      response.subscribe({
        next: this.handleNext.bind(this),
        error: this.handleError.bind(this)
      });
    } else {
      await this.snackService.showSnack('Try cancelling the request after refreshing the page.', 'OK');
    }
  }

  private async handleNext(result: Result<Information>): Promise<void> {
    if (result.success) {
      if (result.data.emailAddressChanged) {
        this._formGroup.setValue({
          oldEmailAddress: result.data.emailAddressChanged.oldEmailAddress,
          newEmailAddress: result.data.emailAddressChanged.newEmailAddress
        });

        this._code = result.data.emailAddressChanged.code;

        switch (result.data.emailAddressChanged.status) {
          case 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED':
            this._status = 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED';
            break;

          case 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED':
            this._status = 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED';
            break;

          default:
            await this.snackService.showSnack(`Contact support because the server sent a response that could not be understood.`, 'OK');
            break;
        }
      } else {
        const oldEmailAddress: string = this.tokenService.session?.emailAddress || '';

        this._formGroup.setValue({
          oldEmailAddress,
          newEmailAddress: ''
        });

        this._code = '';
        this._status = 'NOT_STARTED';
      }
    } else {
      await this.snackService.showSnack(`Try again after refreshing the page because ${result.error.message}.`, 'OK');
    }
  }

  private async handleError(error: unknown): Promise<void> {
    await this.snackService.showSnack(`Contact support because the server sent a response that indicates failure.`, 'OK');
  }
}
