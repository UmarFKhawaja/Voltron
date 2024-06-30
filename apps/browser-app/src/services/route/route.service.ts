import { Injectable } from '@angular/core';
import { NavigationExtras, Params, Router } from '@angular/router';
import { RouteClient } from '../../clients/route/route.client';

@Injectable()
export class RouteService {
  constructor(
    private route: RouteClient
  ) {
  }

  async parseParams(action: (params: Params, router: Router) => Promise<void>): Promise<RouteClient> {
    return this.route.parseParams(action);
  }

  async navigate(commands: string[], extras: NavigationExtras) {
    return this.route.navigate(commands, extras);
  }
}
