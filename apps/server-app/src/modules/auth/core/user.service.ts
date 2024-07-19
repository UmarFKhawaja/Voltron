import { Inject, Injectable } from '@nestjs/common';
import { ProviderType, User, UserService } from '@voltron/core-library';
import { MONGO_CONSTANTS } from '@voltron/data-library';
import { compareSync, hashSync } from 'bcryptjs';

@Injectable()
export class AuthUserService {
  constructor(
    @Inject(MONGO_CONSTANTS.Symbols.Services.UserService)
    private readonly userService: UserService
  ) {
  }

  async registerUser(displayName: string, userName: string, emailAddress: string, password: string): Promise<User> {
    let user: User | null = null;

    if (!user) {
      user = await this.userService.findUserByUsername(emailAddress);

      if (user) {
        throw new Error('a user with that email address is already registered');
      }
    }

    if (!user) {
      user = await this.userService.findUserByUsername(userName);

      if (user) {
        throw new Error('a user with that user name is already registered');
      }
    }

    user = await this.userService.createUser(displayName, userName, emailAddress, password);

    return user;
  }

  async ensureUserWithProvider(displayName: string, userName: string, emailAddress: string, providerType: ProviderType, providerID: string): Promise<User> {
    let user: User | null = await this.userService.findUserByProvider(providerType, providerID);

    if (user) {
      return user;
    }

    if (!emailAddress) {
      throw new Error('an OAuth user must have an email address');
    }

    user = await this.userService.findUserByUsername(emailAddress);

    if (!user) {
      user = await this.userService.createUser(displayName, userName, emailAddress, '');

      user = await this.userService.verifyUser(user._id);
    }

    user = await this.userService.linkUserToProvider(user._id, providerType, providerID);

    return user;
  }

  async ensureUserNotWithProvider(user: User, providerType: ProviderType): Promise<User> {
    user = await this.userService.unlinkUserFromProvider(user._id, providerType);

    return user;
  }

  async updateUser(user: User, displayName: string, userName: string): Promise<User> {
    user = await this.userService.updateUser(user._id, displayName, userName, user.emailAddress);

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async verifyUser(user: User): Promise<User> {
    user = await this.userService.verifyUser(user._id);

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async resetPassword(user: User): Promise<User> {
    user = await this.userService.unsetPassword(user._id);

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async changeEmailAddress(user: User, emailAddress: string): Promise<User> {
    user = await this.userService.updateUser(user._id, user.displayName, user.userName, emailAddress);

    return user;
  }

  async changePassword(user: User, oldPassword: string, newPassword: string): Promise<User> {
    if (!compareSync(oldPassword, user.saltHash)) {
      throw new Error('the old password is incorrect');
    }

    user = await this.userService.setPassword(user._id, hashSync(newPassword));

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async setPassword(user: User, newPassword: string): Promise<User> {
    if (user.saltHash) {
      throw new Error('the old password hasn\'t been provided');
    }

    user = await this.userService.setPassword(user._id, hashSync(newPassword));

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async unsetPassword(user: User, oldPassword: string): Promise<User> {
    if (!compareSync(oldPassword, user.saltHash)) {
      throw new Error('the old password is incorrect');
    }

    user = await this.userService.unsetPassword(user._id);

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async getUserByID(id: string): Promise<User> {
    const user: User = await this.userService.getUserByID(id);

    return user;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user: User | null = await this.userService.findUserByUsername(username);

    return user;
  }
}
