import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ChangeEmailAddressFormComponent
} from '../../components/change-email-address-form/change-email-address-form.component';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { TitleComponent } from '../../components/title/title.component';

@Component({
  selector: 'app-change-email-address',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent,
    ChangeEmailAddressFormComponent
  ],
  templateUrl: './change-email-address.component.html',
  styleUrl: './change-email-address.component.scss'
})
export class ChangeEmailAddressComponent {
}
