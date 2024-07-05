import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouteClient } from '../../clients/route/route.client';
import { ContainerComponent } from '../../components/container/container.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { LabelComponent } from '../../components/label/label.component';
import { SocialButtonsComponent } from '../../components/social-buttons/social-buttons.component';
import { TitleComponent } from '../../components/title/title.component';
import { UpdateProfileFormComponent } from '../../components/update-profile-form/update-profile-form.component';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-manage-profile',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    LabelComponent,
    DividerComponent,
    SocialButtonsComponent,
    UpdateProfileFormComponent
  ],
  providers: [
    RouteClient,
    RouteService
  ],
  templateUrl: './manage-profile.component.html',
  styleUrl: './manage-profile.component.scss'
})
export class ManageProfileComponent {
}
