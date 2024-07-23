import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';

@Component({
  selector: 'app-show-terms-and-conditions',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    ContainerComponent,
    HolderComponent
  ],
  templateUrl: './show-terms-and-conditions.component.html',
  styleUrl: './show-terms-and-conditions.component.scss',
  preserveWhitespaces: true
})
export class ShowTermsAndConditionsComponent {
}
