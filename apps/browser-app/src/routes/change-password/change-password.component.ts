import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouteClient } from '../../clients/route/route.client';
import { ChangePasswordFormComponent } from '../../components/change-password-form/change-password-form.component';
import { ContainerComponent } from '../../components/container/container.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { LabelComponent } from '../../components/label/label.component';
import { SocialButtonsComponent } from '../../components/social-buttons/social-buttons.component';
import { TitleComponent } from '../../components/title/title.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    LabelComponent,
    DividerComponent,
    SocialButtonsComponent,
    ChangePasswordFormComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
}
