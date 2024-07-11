import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Result, Token } from '@voltron/common-library';
import { Observable } from 'rxjs';
import { constants } from '../../app/app.constants';
import { RouteClient } from '../../clients/route/route.client';
import { RouteService } from '../../services/route/route.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  token: string;

  constructor(
    private readonly routeService: RouteService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    this.token = '';
  }

  async ngOnInit(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.routeService.parseParams(async (params: Params, router: Router): Promise<void> => {
      this.token = params['token'];

      const response: Observable<Result<Token>> = await this.userService.resetPassword(this.token);

      response.subscribe({
        next: async (result: Result<Token>) => {
          if (result.success) {
            const token: string = result.data.token;

            this.tokenService.token$.subscribe({
              next: async (): Promise<void> => {
                await this.routeService.navigate(['app', 'set-password'], {});
              }
            });

            this.tokenService.saveToken(token);
          } else {
            await this.routeService.navigate(['app', 'show-message', constants.CODES.RESET_PASSWORD.CHECK], {});
          }
        },
        error: async (error: unknown): Promise<void> => {
          await this.routeService.navigate(['app', 'show-message', constants.CODES.RESET_PASSWORD.CHECK], {});
        }
      });
    });
  }
}
