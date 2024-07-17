import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { TitleComponent } from '../../components/title/title.component';

@Component({
  selector: 'app-connect-google',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent
  ],
  providers: [],
  templateUrl: './connect-google.component.html',
  styleUrl: './connect-google.component.scss'
})
export class ConnectGoogleComponent implements OnInit {
  ngOnInit(): void {
    window.location.href = '/api/auth/connect/google?path=/app/manage-profile';
  }
}
