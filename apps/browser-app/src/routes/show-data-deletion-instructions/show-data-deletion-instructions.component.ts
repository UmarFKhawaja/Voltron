import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';

@Component({
  selector: 'app-show-data-deletion-instructions',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    ContainerComponent,
    HolderComponent
  ],
  templateUrl: './show-data-deletion-instructions.component.html',
  styleUrl: './show-data-deletion-instructions.component.scss',
  preserveWhitespaces: true
})
export class ShowDataDeletionInstructionsComponent {
}
