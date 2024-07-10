import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { TitleComponent } from '../../components/title/title.component';

@Component({
  selector: 'app-login-facebook',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent
  ],
  providers: [],
  templateUrl: './login-facebook.component.html',
  styleUrl: './login-facebook.component.scss'
})
export class LoginFacebookComponent implements OnInit {
  ngOnInit(): void {
    window.location.href = '/api/auth/login/facebook';
  }
}
