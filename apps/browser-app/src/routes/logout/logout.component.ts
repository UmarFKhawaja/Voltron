import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Params, Router, RouterModule } from '@angular/router';
import { Result } from '@voltron/common-library';
import { Observable } from 'rxjs';
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
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  constructor(
    private readonly routeService: RouteService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.routeService.parseParams(async (params: Params, router: Router): Promise<void> => {
      const token: string = this.tokenService.token;

      const logout = async (): Promise<void> => {
        this.tokenService.removeToken();

        await router.navigate(['']);
      };

      const response: Observable<Result<void>> = await this.userService.logout(token);

      response.subscribe({
        next: logout,
        error: logout
      });
    });
  }
}
