import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Params, Router, RouterModule } from '@angular/router';
import { RouteClient } from '../../clients/route.client';
import { ACCESS_TOKEN, MESSAGES } from '../../constants';
import { RouteService } from '../../services/route/route.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-accept',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.css'
})
export class AcceptComponent {
  method: string;
  token: string;

  constructor(
    private routeService: RouteService,
    private storageService: StorageService
  ) {
    this.method = '';
    this.token = '';
  }

  async ngOnInit(): Promise<void> {
    await this.routeService.parseParams(async (params: Params, router: Router): Promise<void> => {
      this.method = params['method'];
      this.token = params['token'];

      if (this.token) {
        this.storageService.saveToSession(ACCESS_TOKEN, this.token);

        await router.navigate(['']);
      } else {
        await router.navigate(['app', 'show-message', MESSAGES.LOGIN.MAGIC_LOGIN.RETRY_AUTHENTICATION]);
      }
    });
  }
}
