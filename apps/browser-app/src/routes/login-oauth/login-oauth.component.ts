import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-login-oauth',
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
  templateUrl: './login-oauth.component.html',
  styleUrl: './login-oauth.component.scss'
})
export class LoginOAuthComponent implements OnInit {
  providerName: string = 'Provider';

  providerSlug: string = 'provider';

  constructor(
    private readonly routeService: RouteService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.routeService.parseParams(async (params: Params, router: Router) => {
      this.providerSlug = params['provider'];

      switch (params['provider']) {
        case 'facebook':
          this.providerName = 'Facebook';
          break;

        case 'google':
          this.providerName = 'Google';
          break;
      }

      window.location.href = `/api/auth/login/${this.providerSlug}?path=/`;
    });
  }
}
