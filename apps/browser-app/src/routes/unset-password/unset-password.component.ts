import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { LabelComponent } from '../../components/label/label.component';
import { SocialButtonsComponent } from '../../components/social-buttons/social-buttons.component';
import { TitleComponent } from '../../components/title/title.component';
import { UnsetPasswordFormComponent } from '../../components/unset-password-form/unset-password-form.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-unset-password',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    LabelComponent,
    DividerComponent,
    SocialButtonsComponent,
    UnsetPasswordFormComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './unset-password.component.html',
  styleUrl: './unset-password.component.scss'
})
export class UnsetPasswordComponent {
}
