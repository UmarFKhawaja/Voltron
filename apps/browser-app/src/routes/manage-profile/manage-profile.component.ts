import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { LabelComponent } from '../../components/label/label.component';
import { SocialButtonsComponent } from '../../components/social-buttons/social-buttons.component';
import { TitleComponent } from '../../components/title/title.component';

@Component({
  selector: 'app-manage-profile',
  standalone: true,
  imports: [CommonModule, ContainerComponent, HolderComponent, TitleComponent, LabelComponent, DividerComponent, SocialButtonsComponent],
  templateUrl: './manage-profile.component.html',
  styleUrl: './manage-profile.component.scss'
})
export class ManageProfileComponent {
}
