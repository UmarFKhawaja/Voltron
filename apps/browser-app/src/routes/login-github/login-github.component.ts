import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../../components/container/container.component';
import { HolderComponent } from '../../components/holder/holder.component';
import { TitleComponent } from '../../components/title/title.component';

@Component({
  selector: 'app-login-github',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    HolderComponent,
    TitleComponent
  ],
  providers: [],
  templateUrl: './login-github.component.html',
  styleUrl: './login-github.component.css'
})
export class LoginGitHubComponent implements OnInit {
  ngOnInit(): void {
    window.location.href = '/api/auth/login/github';
  }
}
