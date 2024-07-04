import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Params, Router, RouterModule } from '@angular/router';
import { Result, Token } from '@voltron/common-library';
import { constants } from '../../app/app.constants';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { LabelComponent } from '../../components/label/label.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-accept',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    LabelComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.css'
})
export class AcceptComponent implements OnInit {
  method: string;
  token: string;

  constructor(
    private readonly routeService: RouteService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    this.method = '';
    this.token = '';
  }

  async ngOnInit(): Promise<void> {
    await this.routeService.parseParams(async (params: Params, router: Router): Promise<void> => {
      this.method = params['method'];
      this.token = params['token'];

      if (this.token) {
        const result = await this.userService.acceptMagicLogin(this.token);

        result.subscribe({
          next: async (result: Result<Token>): Promise<void> => {
            if (result.success) {
              this.tokenService.saveToken(result.data.access_token);

              await router.navigate(['']);
            } else {
              await router.navigate(['app', 'show-message', constants.MESSAGES.LOGIN.MAGIC_LOGIN.CHECK]);
            }
          },
          error: async (error: unknown): Promise<void> => {
            await router.navigate(['app', 'show-message', constants.MESSAGES.LOGIN.MAGIC_LOGIN.CHECK]);
          }
        });
      } else {
        await router.navigate(['app', 'show-message', constants.MESSAGES.LOGIN.MAGIC_LOGIN.RETRY]);
      }
    });
  }
}
