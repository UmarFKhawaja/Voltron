import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Params, Router } from '@angular/router';
import { EmailAddressChanged, Information, Result, Token } from '@voltron/common-library';
import { Observable } from 'rxjs';
import { constants } from '../../app/app.constants';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';
import { SnackService } from '../../services/snack/snack.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-complete-email-address-change',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './complete-email-address-change.component.html',
  styleUrl: './complete-email-address-change.component.scss'
})
export class CompleteEmailAddressChangeComponent {
  token: string;

  code: string;

  constructor(
    private readonly routeService: RouteService,
    private readonly snackService: SnackService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    this.token = '';
    this.code = '';
  }

  async ngOnInit(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.routeService.parseParams(async (params: Params, router: Router): Promise<void> => {
      this.token = params['token'];
      this.code = params['code'];

      this.tokenService.saveToken(this.token);

      const response: Observable<Result<Token>> = await this.userService.completeEmailAddressChange(this.token, this.code);

      response.subscribe({
        next: async (result: Result<Token>): Promise<void> => {
          if (result.success) {
            const token: string = result.data.token;

            this.tokenService.saveToken(token);

            await this.routeService.navigate(['app', 'show-message', constants.CODES.COMPLETE_EMAIL_ADDRESS_CHANGE.CONFIRM], {});
          } else {
            await this.snackService.showSnack(constants.MESSAGES.COMPLETE_EMAIL_ADDRESS_CHANGE.CHECK, 'OK');
          }
        },
        error: async (error: unknown): Promise<void> => {
          await this.snackService.showSnack(constants.MESSAGES.COMPLETE_EMAIL_ADDRESS_CHANGE.CHECK, 'OK');
        }
      });
    });
  }
}
