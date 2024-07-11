import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Result, Token } from '@voltron/common-library';
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
  selector: 'app-disconnect-google',
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
  templateUrl: './disconnect-google.component.html',
  styleUrl: './disconnect-google.component.scss'
})
export class DisconnectGoogleComponent implements OnInit {
  constructor(
    private readonly routeService: RouteService,
    private readonly snackService: SnackService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const token: string = this.tokenService.token;

    const response: Observable<Result<Token>> = await this.userService.disconnectGoogle(token);

    response.subscribe({
      next: async (result: Result<Token>): Promise<void> => {
        if (result.success) {
          this.tokenService.saveToken(result.data.token);

          await this.routeService.navigate(['app', 'manage-profile'], {});
        } else {
          await this.snackService.showSnack(constants.MESSAGES.DISCONNECT_ACCOUNT.GOOGLE.CHECK, 'OK');
        }
      },
      error: async () => {
        await this.snackService.showSnack(constants.MESSAGES.GENERAL.TRY_LATER, 'OK');
      }
    });
  }
}
