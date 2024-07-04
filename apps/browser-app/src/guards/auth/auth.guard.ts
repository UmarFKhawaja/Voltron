import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { constants } from '../../app/app.constants';
import { RouteClient } from '../../clients/route/route.client';
import { RouteService } from '../../services/route/route.service';
import { TokenService } from '../../services/token/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  const router: Router = inject(Router);
  const routeClient: RouteClient = new RouteClient(activatedRoute, router);

  const routeService: RouteService = new RouteService(routeClient);
  const tokenService: TokenService = inject(TokenService);

  const isAuthenticated: boolean = tokenService.isAuthenticated;

  if (!isAuthenticated) {
    routeService.navigate(['app', 'show-message', constants.MESSAGES.GENERAL.NOT_AUTHENTICATED], {})
      .then()
      .catch();
  }

  return isAuthenticated;
};
