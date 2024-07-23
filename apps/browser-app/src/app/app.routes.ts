import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth/auth.guard';
import { AcceptComponent } from '../routes/accept/accept.component';
import { ActivateAccountComponent } from '../routes/activate-account/activate-account.component';
import { ChangeEmailAddressComponent } from '../routes/change-email-address/change-email-address.component';
import { ChangePasswordComponent } from '../routes/change-password/change-password.component';
import {
  CompleteEmailAddressChangeComponent
} from '../routes/complete-email-address-change/complete-email-address-change.component';
import {
  ConfirmEmailAddressChangeComponent
} from '../routes/confirm-email-address-change/confirm-email-address-change.component';
import { ConnectOAuthComponent } from '../routes/connect-oauth/connect-oauth.component';
import { DisconnectOAuthComponent } from '../routes/disconnect-oauth/disconnect-oauth.component';
import { LoginOAuthComponent } from '../routes/login-oauth/login-oauth.component';
import { LoginComponent } from '../routes/login/login.component';
import { LogoutComponent } from '../routes/logout/logout.component';
import { ManageProfileComponent } from '../routes/manage-profile/manage-profile.component';
import { RecoverAccountComponent } from '../routes/recover-account/recover-account.component';
import { RegisterComponent } from '../routes/register/register.component';
import { RequestActivationCodeComponent } from '../routes/request-activation-code/request-activation-code.component';
import { ResetPasswordComponent } from '../routes/reset-password/reset-password.component';
import { SetPasswordComponent } from '../routes/set-password/set-password.component';
import {
  ShowDataDeletionInstructionsComponent
} from '../routes/show-data-deletion-instructions/show-data-deletion-instructions.component';
import { ShowMessageComponent } from '../routes/show-message/show-message.component';
import { ShowPrivacyPolicyComponent } from '../routes/show-privacy-policy/show-privacy-policy.component';
import { UnsetPasswordComponent } from '../routes/unset-password/unset-password.component';

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
    path: 'app/login/:provider',
    component: LoginOAuthComponent
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
    path: 'app/connect/:provider',
    component: ConnectOAuthComponent
  },
  {
    path: 'app/disconnect/:provider',
    component: DisconnectOAuthComponent
  },
  {
    path: 'app/activate-account',
    component: ActivateAccountComponent
  },
  {
    path: 'app/request-activation-code',
    component: RequestActivationCodeComponent
  },
  {
    path: 'app/recover-account',
    component: RecoverAccountComponent
  },
  {
    path: 'app/manage-profile',
    component: ManageProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'app/change-email-address',
    component: ChangeEmailAddressComponent,
    canActivate: [authGuard]
  },
  {
    path: 'app/confirm-email-address-change',
    component: ConfirmEmailAddressChangeComponent
  },
  {
    path: 'app/complete-email-address-change',
    component: CompleteEmailAddressChangeComponent
  },
  {
    path: 'app/reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'app/change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard]
  },
  {
    path: 'app/set-password',
    component: SetPasswordComponent,
    canActivate: [authGuard]
  },
  {
    path: 'app/unset-password',
    component: UnsetPasswordComponent,
    canActivate: [authGuard]
  },
  {
    path: 'app/show-message',
    component: ShowMessageComponent
  },
  {
    path: 'app/show-message/:code',
    component: ShowMessageComponent
  },
  {
    path: 'app/show-privacy-policy',
    component: ShowPrivacyPolicyComponent
  },
  {
    path: 'app/show-data-deletion-instructions',
    component: ShowDataDeletionInstructionsComponent
  }
];
