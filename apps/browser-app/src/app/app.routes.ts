import { Routes } from '@angular/router';
import { LoginComponent } from '../routes/login/login.component';
import { RegisterComponent } from '../routes/register/register.component';

export const routes: Routes = [
  {
    path: 'app/login',
    component: LoginComponent
  },
  {
    path: 'app/register',
    component: RegisterComponent
  }
];
