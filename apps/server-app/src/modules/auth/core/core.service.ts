import { Inject, Injectable } from '@nestjs/common';
import { EmailAddressChanged, Information } from '@voltron/common-library';
import {
  AccessAction,
  AccessService,
  MailService,
  ProviderType,
  User,
  VerificationRequest,
  VerificationRequestPurpose
} from '@voltron/core-library';
import { CERBOS_CONSTANTS, REDIS_CONSTANTS } from '@voltron/data-library';
import { compareSync } from 'bcryptjs';
import { AUTH_CONSTANTS } from '../auth.constants';
import { AuthTokenService } from './token.service';
import { AuthURLService } from './url.service';
import { AuthUserService } from './user.service';
import { AuthVerificationRequestService } from './verification-request.service';

@Injectable()
export class AuthCoreService {
  constructor(
    @Inject(CERBOS_CONSTANTS.Symbols.Services.AccessService)
    private readonly accessService: AccessService,
    @Inject(REDIS_CONSTANTS.Symbols.Services.MailService)
    private readonly mailService: MailService,
    private readonly tokenService: AuthTokenService,
    private readonly urlService: AuthURLService,
    private readonly userService: AuthUserService,
    private readonly verificationRequestService: AuthVerificationRequestService
  ) {
  }

  async register(displayName: string, userName: string, emailAddress: string, password: string): Promise<void> {
    const user: User = await this.userService.registerUser(displayName, userName, emailAddress, password);

    const verificationRequest: VerificationRequest = await this.verificationRequestService.createRegisterVerificationRequest(user);

    const verificationURL: string = this.urlService.formatRegisterVerificationURL(verificationRequest);

    await this.mailService.sendRegisterMail(user.emailAddress, verificationURL);
  }

  async requestActivationCode(username: string): Promise<void> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new Error('a user with the specified username could not be found');
    }

    if (user.verifiedAt) {
      throw new Error('the user with the specified username is already activated');
    }

    const verificationRequest: VerificationRequest = await this.verificationRequestService.createRegisterVerificationRequest(user);

    const verificationURL: string = this.urlService.formatRegisterVerificationURL(verificationRequest);

    await this.mailService.sendRegisterMail(user.emailAddress, verificationURL);
  }

  async activateAccount(activationCode: string): Promise<User> {
    let user: User | null = await this.verificationRequestService.getUserForVerificationRequest(activationCode);

    const verificationRequest: VerificationRequest = await this.verificationRequestService.completeVerificationRequest(user, activationCode);

    user = await this.userService.verifyUser(user);

    if (!user) {
      throw new Error('a user with the specified ID could not be found');
    }

    if (!user.verifiedAt) {
      throw new Error('the user with the specified user ID is not verified');
    }

    return user;
  }

  async recoverAccount(username: string): Promise<void> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      return;
    }

    const token: string = await this.tokenService.createToken(user);

    const confirmationURL: string = this.urlService.formatRecoverAccountConfirmationURL(token);

    await this.mailService.sendResetPasswordMail(user.emailAddress, confirmationURL);
  }

  async getUserByID(id: string): Promise<User> {
    const user: User = await this.userService.getUserByID(id);

    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new Error('a user with that username could not be found');
    }

    return user;
  }

  async getInformation(user: User): Promise<Information> {
    const verificationRequest: VerificationRequest | null = await this.verificationRequestService
      .findVerificationRequestByUserAndPurpose(user, VerificationRequestPurpose.CHANGE_EMAIL_ADDRESS);

    const hasAccess: boolean = await this.accessService.checkVerificationRequestAccess(user, verificationRequest, AccessAction.SELECT);

    if (!hasAccess) {
      throw new Error('you do not have access to the information');
    }

    const information: Information = {
      emailAddressChanged: this.createEmailAddressChanged(verificationRequest)
    };

    return information;
  }

  async updateProfile(user: User, displayName: string, userName: string): Promise<User> {
    const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

    if (!hasAccess) {
      throw new Error('you do not have access to the profile');
    }

    user = await this.userService.updateUser(user, displayName, userName);

    return user;
  }

  async startEmailAddressChange(user: User, emailAddress: string): Promise<Information> {
    const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

    if (!hasAccess) {
      throw new Error('you do not have access to change the email address');
    }

    const token: string = await this.tokenService.createToken(user);

    const verificationRequest: VerificationRequest = await this.verificationRequestService
      .createChangeEmailVerificationRequest(user, emailAddress, 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED');

    const confirmationURL: string = this.urlService
      .formatConfirmEmailAddressChangeConfirmationURL(token, verificationRequest.code);

    const hasSucceeded: boolean = await this.mailService
      .sendConfirmEmailAddressChange(
        user.emailAddress,
        confirmationURL
      );

    if (!hasSucceeded) {
      throw new Error('the email containing confirmation link could not be sent');
    }

    return {
      emailAddressChanged: this.createEmailAddressChanged(verificationRequest)
    };
  }

  async confirmEmailAddressChange(user: User, confirmationCode: string): Promise<Information> {
    const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

    if (!hasAccess) {
      throw new Error('you do not have access to confirm the email address');
    }

    let verificationRequest: VerificationRequest | null = await this.verificationRequestService.completeVerificationRequest(user, confirmationCode);

    if (!verificationRequest) {
      throw new Error('a verification request corresponding to the specified confirmation code could not be found');
    }

    const { newEmailAddress: emailAddress } = verificationRequest.details as EmailAddressChanged;

    verificationRequest = await this.verificationRequestService
      .createChangeEmailVerificationRequest(user, emailAddress, 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED');

    const token: string = await this.tokenService.createToken(user);

    const confirmationURL: string = this.urlService.formatCompleteEmailAddressChangeConfirmationURL(token, verificationRequest.code);

    const hasSucceeded: boolean = await this.mailService.sendConfirmEmailAddressChange(
      emailAddress,
      confirmationURL
    );

    if (!hasSucceeded) {
      throw new Error('the email containing confirmation link could not be sent');
    }

    return {
      emailAddressChanged: this.createEmailAddressChanged(verificationRequest)
    };
  }

  async completeEmailAddressChange(user: User, confirmationCode: string): Promise<User> {
    const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

    if (!hasAccess) {
      throw new Error('you do not have access to complete the email address');
    }

    let verificationRequest: VerificationRequest | null = await this.verificationRequestService.findVerificationRequestByCode(confirmationCode);

    if (!verificationRequest) {
      throw new Error('the verification code with the specified confirmation code could not be found');
    }

    if (verificationRequest.userID !== user._id.toString()) {
      throw new Error('the verification request with the specified confirmation code belongs to a different user');
    }

    const {
      newEmailAddress: emailAddress
    } = verificationRequest.details as {
      oldEmailAddress: string;
      newEmailAddress: string
    };

    user = await this.userService.changeEmailAddress(user, emailAddress);

    verificationRequest = await this.verificationRequestService.completeVerificationRequest(user, confirmationCode);

    if (!verificationRequest) {
      throw new Error('a verification request corresponding to the specified confirmation code could not be found');
    }

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async cancelEmailAddressChange(user: User, confirmationCode: string): Promise<Information> {
    const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

    if (!hasAccess) {
      throw new Error('you do not have access to cancel the email address');
    }

    const verificationRequest: VerificationRequest | null = await this.verificationRequestService.cancelVerificationRequest(user, confirmationCode);

    if (!verificationRequest) {
      throw new Error('a verification request corresponding to the specified confirmation code could not be found');
    }

    return {
      emailAddressChanged: null
    };
  }

  async resendEmailAddressChange(user: User): Promise<Information> {
    const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

    if (!hasAccess) {
      throw new Error('you do not have access to confirm the email address');
    }

    const verificationRequest: VerificationRequest | null = await this.verificationRequestService
      .recreateVerificationRequest(user, VerificationRequestPurpose.CHANGE_EMAIL_ADDRESS);

    if (!verificationRequest) {
      throw new Error('a verification request to resend could not be found');
    }

    const emailAddressChanged: EmailAddressChanged = verificationRequest.details as EmailAddressChanged;

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let hasSuccess: boolean = false;

    switch (emailAddressChanged.status) {
      case 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED': {
        const token: string = await this.tokenService.createToken(user);
        const confirmationURL: string = this.urlService.formatConfirmEmailAddressChangeConfirmationURL(token, verificationRequest.code);

        hasSuccess = await this.mailService.sendConfirmEmailAddressChange(emailAddressChanged.oldEmailAddress, confirmationURL);
        break;
      }

      case 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED': {
        const token: string = await this.tokenService.createToken(user);
        const confirmationURL: string = this.urlService.formatCompleteEmailAddressChangeConfirmationURL(token, verificationRequest.code);

        hasSuccess = await this.mailService.sendCompleteEmailAddressChange(emailAddressChanged.newEmailAddress, confirmationURL);
        break;
      }
    }

    if (!hasSuccess) {
      throw new Error('an email could not be sent');
    }

    const information: Information = {
      emailAddressChanged: this.createEmailAddressChanged(verificationRequest)
    };

    return information;
  }

  async validateUser(user: User): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const isValid: boolean = !!user.verifiedAt;

    return isValid;
  }

  async checkPassword(user: User, password: string): Promise<boolean> {
    if (!user.saltHash) {
      return false;
    }

    const isValid: boolean = compareSync(password, user.saltHash);

    return isValid;
  }

  async resetPassword(user: User): Promise<User> {
    user = await this.userService.resetPassword(user);

    return user;
  }

  async changePassword(user: User, oldPassword: string, newPassword: string): Promise<User> {
    user = await this.userService.changePassword(user, oldPassword, newPassword);

    return user;
  }

  async setPassword(user: User, newPassword: string): Promise<User> {
    user = await this.userService.setPassword(user, newPassword);

    return user;
  }

  async unsetPassword(user: User, oldPassword: string): Promise<User> {
    user = await this.userService.unsetPassword(user, oldPassword);

    return user;
  }

  async ensureUserWithProvider(displayName: string, userName: string, emailAddress: string, providerType: ProviderType, providerID: string): Promise<User> {
    const user: User = await this.userService.ensureUserWithProvider(displayName, userName, emailAddress, providerType, providerID);

    return user;
  }

  async ensureUserNotWithProvider(user: User, providerType: ProviderType): Promise<User> {
    user = await this.userService.ensureUserNotWithProvider(user, providerType);

    return user;
  }

  async checkUsername(username: string): Promise<User> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new Error('a user could not be found');
    }

    const isValid: boolean = (
      await Promise.all(
        [
          await this.validateUser(user)
        ]
      )
    )
      .every((value: boolean) => value);

    if (!isValid) {
      throw new Error('the user could not be validated');
    }

    return user;
  }

  async checkUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new Error('a user could not be found');
    }

    const isValid: boolean = (
      await Promise.all(
        [
          await this.validateUser(user),
          await this.checkPassword(user, password)
        ]
      )
    )
      .every((value: boolean) => value);

    if (!isValid) {
      throw new Error('the user could not be validated');
    }

    return user;
  }

  async checkUserByUsername(username: string): Promise<User> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new Error('a user could not be found');
    }

    const isValid: boolean = (
      await Promise.all(
        [
          await this.validateUser(user)
        ]
      )
    )
      .every((value: boolean) => value);

    if (!isValid) {
      throw new Error('the user could not be validated');
    }

    return user;
  }

  async checkUserByID(id: string): Promise<User> {
    const user: User = await this.userService.getUserByID(id);

    const isValid: boolean = (
      await Promise.all(
        [
          await this.validateUser(user)
        ]
      )
    )
      .every((value: boolean) => value);

    if (!isValid) {
      throw new Error('the user could not be validated');
    }

    return user;
  }

  async sendMagicLink(username: string, confirmationURL: string): Promise<void> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new Error('a user with that username could not be found');
    }

    const magicLoginConfirmationURL: string = new URL(confirmationURL, AUTH_CONSTANTS.Strategies.MagicLogin.baseURL).toString();

    const isSuccess: boolean = await this.mailService.sendLoginWithMagicLoginMail(user.emailAddress, magicLoginConfirmationURL);

    if (!isSuccess) {
      throw new Error('an email containing the confirmation link could not be sent');
    }
  }

  private createEmailAddressChanged(verificationRequest: VerificationRequest | null): EmailAddressChanged | null {
    const emailAddressChanged: EmailAddressChanged | null = verificationRequest
      ? {
        code: verificationRequest.code,
        ...verificationRequest.details
      } as EmailAddressChanged : null;

    return emailAddressChanged;
  }
}
