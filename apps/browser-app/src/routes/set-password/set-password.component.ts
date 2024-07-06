import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { LabelComponent } from '../../components/label/label.component';
import { SocialButtonsComponent } from '../../components/social-buttons/social-buttons.component';
import { TitleComponent } from '../../components/title/title.component';
import { SetPasswordFormComponent } from '../../components/set-password-form/set-password-form.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    LabelComponent,
    DividerComponent,
    SocialButtonsComponent,
    SetPasswordFormComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss'
})
export class SetPasswordComponent {
}
