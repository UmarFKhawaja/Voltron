import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';

@Component({
  selector: 'app-show-privacy-policy',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    ContainerComponent,
    HolderComponent
  ],
  templateUrl: './show-privacy-policy.component.html',
  styleUrl: './show-privacy-policy.component.scss',
  preserveWhitespaces: true
})
export class ShowPrivacyPolicyComponent {
}
