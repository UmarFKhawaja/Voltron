import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Injectable()
export class RouteClient {
  constructor(
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  async parseParams(action: (params: Params, router: Router) => Promise<void>): Promise<RouteClient> {
    combineLatest([this.route.params, this.route.queryParams])
      .subscribe((params: Params): void => {
        action({
          ...params[0],
          ...params[1]
        }, this.router);
      });

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async navigate(commands: any[], extras: NavigationExtras): Promise<RouteClient> {
    await this.router.navigate(commands, extras);

    return this;
  }

  async navigateBack(): Promise<RouteClient> {
    this.location.back();

    return this;
  }
}
