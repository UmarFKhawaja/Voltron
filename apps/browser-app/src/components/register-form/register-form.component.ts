import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Result } from '@voltron/common-library';
import { Observable } from 'rxjs';
import { MESSAGES } from '../../constants';
import { RouteService } from '../../services/route/route.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  private readonly _formGroup: FormGroup;

  constructor(
    private readonly routeService: RouteService,
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
        await this.routeService.navigate(['app', 'show-message', MESSAGES.REGISTER.VERIFY], {});
      } else {
        await this.routeService.navigate(['app', 'show-message', MESSAGES.REGISTER.CHECK], {});
      }
    });
  }
}
