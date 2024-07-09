import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { RecoverAccountFormComponent } from '../../components/recover-account-form/recover-account-form.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-recover-account',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    RecoverAccountFormComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './recover-account.component.html',
  styleUrl: './recover-account.component.scss'
})
export class RecoverAccountComponent {
}
