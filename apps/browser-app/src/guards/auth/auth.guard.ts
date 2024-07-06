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

  return checkAuthentication(routeService, tokenService);
};

async function checkAuthentication(routeService: RouteService, tokenService: TokenService): Promise<boolean> {
  let isAuthenticated: boolean = tokenService.hasToken && (await tokenService.validateToken());

  if (!isAuthenticated) {
    tokenService.removeToken();

    await routeService.navigate(['app', 'show-message', constants.CODES.GENERAL.NOT_AUTHENTICATED], {});
  }

  return isAuthenticated;
}
