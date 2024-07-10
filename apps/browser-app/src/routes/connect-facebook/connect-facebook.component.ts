import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { TitleComponent } from '../../components/title/title.component';

@Component({
  selector: 'app-connect-facebook',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent
  ],
  providers: [],
  templateUrl: './connect-facebook.component.html',
  styleUrl: './connect-facebook.component.scss'
})
export class ConnectFacebookComponent implements OnInit {
  ngOnInit(): void {
    window.location.href = '/api/auth/connect/facebook';
  }
}
