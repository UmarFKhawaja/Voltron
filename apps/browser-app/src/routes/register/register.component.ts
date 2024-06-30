import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Result } from '@voltron/common-library';
import { Observable, Subscription } from 'rxjs';
import { RouteClient } from '../../clients/route/route.client';
import { MESSAGES } from '../../constants';
import { RouteService } from '../../services/route/route.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly _formGroup: FormGroup;

  private _isAuthenticated$: Subscription = new Subscription();

  constructor(
    private readonly routeService: RouteService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    this._formGroup = new FormGroup({
      displayName: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_.]+$/)),
      emailAddress: new FormControl('', Validators.email),
      password: new FormControl('')
    });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  async ngOnInit(): Promise<void> {
    if (this.tokenService.isAuthenticated) {
      await this.routeService.navigate([''], {});
    }

    this._isAuthenticated$ = this.tokenService.isAuthenticated$.subscribe(async (isAuthenticated: boolean): Promise<void> => {
      if (isAuthenticated) {
        await this.routeService.navigate([''], {});
      }
    });
  }

  ngOnDestroy(): void {
    this._isAuthenticated$.unsubscribe();
  }

  async onSubmit() {
    const {
      displayName,
      userName,
      emailAddress,
      password
    } = this._formGroup.value;

    const response: Observable<Result<void>> = await this.userService.register(displayName, userName, emailAddress, password);

    response.subscribe(async (result: Result<void>): Promise<void> => {
      if (result.success) {
        await this.routeService.navigate(['app', 'show-message', MESSAGES.REGISTER.VERIFY_REGISTRATION], {});
      } else {
        await this.routeService.navigate(['app', 'show-message', MESSAGES.REGISTER.CHECK_REGISTRATION], {});
      }
    });
  }
}
