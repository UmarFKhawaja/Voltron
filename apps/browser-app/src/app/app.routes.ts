import { Routes } from '@angular/router';
import { AcceptComponent } from '../routes/accept/accept.component';
import { LoginComponent } from '../routes/login/login.component';
import { LogoutComponent } from '../routes/logout/logout.component';
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
    path: 'app/logout',
    component: LogoutComponent
  },
  {
    path: 'app/accept/:method',
    component: AcceptComponent
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
