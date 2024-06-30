import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Params, Router, RouterLink } from '@angular/router';
import { RouteClient } from '../../clients/route.client';
import { MESSAGES } from '../../constants';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-show-message',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './show-message.component.html',
  styleUrl: './show-message.component.css'
})
export class ShowMessageComponent {
  code: string;

  constructor(
    private routeService: RouteService
  ) {
    this.code = '';
  }

  async ngOnInit(): Promise<void> {
    await this.routeService.parseParams(async (params: Params, router: Router): Promise<void> => {
      this.code = params['code'];
    });
  }

  protected readonly MESSAGES = MESSAGES;
}
