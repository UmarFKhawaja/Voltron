import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { RouteClient } from '../../clients/route/route.client';
import { ActivateAccountFormComponent } from '../../components/activate-account-form/activate-account-form.component';
import { ContainerComponent } from '../../components/container/container.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    ActivateAccountFormComponent,
    DividerComponent,
    FormsModule
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {
}
