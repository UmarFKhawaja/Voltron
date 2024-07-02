import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Params, Router, RouterLink } from '@angular/router';
import { constants } from '../../app/app.constants';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { LabelComponent } from '../../components/label/label.component';
import { TitleComponent } from '../../components/title/title.component';
import { WarningMessageComponent } from '../../components/warning-message/warning-message.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-show-message',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    LabelComponent,
    ErrorMessageComponent,
    WarningMessageComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './show-message.component.html',
  styleUrl: './show-message.component.css'
})
export class ShowMessageComponent implements OnInit {
  code: string;

  constructor(
    private routeService: RouteService
  ) {
    this.code = '';
  }

  async ngOnInit(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.routeService.parseParams(async (params: Params, router: Router): Promise<void> => {
      this.code = params['code'];
    });
  }

  protected readonly MESSAGES = constants.MESSAGES;
}
