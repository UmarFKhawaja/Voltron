import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-connect-oauth',
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
  templateUrl: './connect-oauth.component.html',
  styleUrl: './connect-oauth.component.scss'
})
export class ConnectOAuthComponent implements OnInit {
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

      window.location.href = `/api/auth/connect/${this.providerSlug}?path=/app/manage-profile`;
    });
  }
}
