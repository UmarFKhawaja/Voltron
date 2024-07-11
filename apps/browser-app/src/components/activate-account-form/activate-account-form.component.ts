import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Params, Router } from '@angular/router';
import { Result, Token } from '@voltron/common-library';
import { Observable } from 'rxjs';
import { constants } from '../../app/app.constants';
import { RouteService } from '../../services/route/route.service';
import { SnackService } from '../../services/snack/snack.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';
import { DividerComponent } from '../divider/divider.component';

@Component({
  selector: 'app-activate-account-form',
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
  templateUrl: './activate-account-form.component.html',
  styleUrl: './activate-account-form.component.scss'
})
export class ActivateAccountFormComponent implements OnInit {
  private readonly _formGroup: FormGroup;

  private _code: string;

  constructor(
    private readonly routeService: RouteService,
    private readonly snackService: SnackService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    this._formGroup = new FormGroup({
      activationCode: new FormControl('', [
        Validators.pattern(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/),
        Validators.required
      ])
    });
    this._code = '';
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  async ngOnInit(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.routeService.parseParams(async (params: Params, router: Router): Promise<void> => {
      this._code = params['code'];

      this._formGroup.setValue({
        activationCode: this._code
      });

      await this.activateAccount(this._code);
    });
  }

  async onSubmit(): Promise<void> {
    const {
      activationCode: code
    } = this._formGroup.value;

    await this.activateAccount(code);
  }

  private async activateAccount(code: string): Promise<void> {
    const response: Observable<Result<Token>> = await this.userService.activateAccount(code);

    response.subscribe({
      next: async (result: Result<Token>): Promise<void> => {
        if (result.success) {
          this.tokenService.saveToken(result.data.token);

          await this.routeService.navigate([''], {});
        } else {
          await this.snackService.showSnack(constants.MESSAGES.ACTIVATE_ACCOUNT.CHECK, 'OK');
        }
      },
      error: async (error: unknown): Promise<void> => {
        await this.snackService.showSnack(constants.MESSAGES.GENERAL.TRY_LATER, 'OK');
      }
    });
  }
}
