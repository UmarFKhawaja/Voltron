import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { SocialButtonsComponent } from '../../components/social-buttons/social-buttons.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    DividerComponent,
    LoginFormComponent,
    SocialButtonsComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private _isAuthenticated$: Subscription = new Subscription();

  constructor(
    private readonly routeService: RouteService,
    private readonly tokenService: TokenService
  ) {
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
}
