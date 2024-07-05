import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth/auth.guard';
import { AcceptComponent } from '../routes/accept/accept.component';
import { LoginGitHubComponent } from '../routes/login-github/login-github.component';
import { LoginGoogleComponent } from '../routes/login-google/login-google.component';
import { LoginComponent } from '../routes/login/login.component';
import { LogoutComponent } from '../routes/logout/logout.component';
import { ManageProfileComponent } from '../routes/manage-profile/manage-profile.component';
import { RegisterComponent } from '../routes/register/register.component';
import { ShowMessageComponent } from '../routes/show-message/show-message.component';

export const routes: Routes = [
  {
    path: 'app/register',
    component: RegisterComponent
  },
  {
    path: 'app/login',
    component: LoginComponent
  },
  {
    path: 'app/login/github',
    component: LoginGitHubComponent
  },
  {
    path: 'app/login/google',
    component: LoginGoogleComponent
  },
  {
    path: 'app/logout',
    component: LogoutComponent
  },
  {
    path: 'app/accept/:method',
    component: AcceptComponent
  },
  {
    path: 'app/manage-profile',
    component: ManageProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'app/show-message',
    component: ShowMessageComponent
  },
  {
    path: 'app/show-message/:code',
    component: ShowMessageComponent
  }
];
