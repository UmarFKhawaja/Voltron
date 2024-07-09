import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { RequestActivationCodeFormComponent } from '../../components/request-activation-code-form/request-activation-code-form.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-request-activation-code',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    RequestActivationCodeFormComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './request-activation-code.component.html',
  styleUrl: './request-activation-code.component.scss'
})
export class RequestActivationCodeComponent {
  constructor(
    private readonly routeService: RouteService
  ) {
  }

  async onGoBack(): Promise<void> {
    await this.routeService.navigateBack();
  }
}
