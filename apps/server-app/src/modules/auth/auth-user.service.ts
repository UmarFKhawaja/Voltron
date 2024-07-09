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

  async updateUser(user: User | null, displayName: string, userName: string): Promise<User | null> {
    if (!user) {
      return null;
    }

    user = await this.userService.updateUser(user._id, displayName, userName, user.emailAddress);

    if (!user) {
      return null;
    }

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async verifyUser(user: User | null): Promise<User | null> {
    if (!user) {
      return null;
    }

    user = await this.userService.verifyUser(user._id);

    if (!user) {
      return null;
    }

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async resetPassword(user: User | null): Promise<User | null> {
    if (!user) {
      return null;
    }

    user = await this.userService.unsetPassword(user._id);

    if (!user) {
      return null;
    }

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async changePassword(user: User | null, oldPassword: string, newPassword: string): Promise<User | null> {
    if (!user) {
      return null;
    }

    if (!compareSync(oldPassword, user.saltHash)) {
      return null;
    }

    user = await this.userService.setPassword(user._id, hashSync(newPassword));

    if (!user) {
      return null;
    }

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async setPassword(user: User | null, newPassword: string): Promise<User | null> {
    if (!user) {
      return null;
    }

    if (user.saltHash) {
      return null;
    }

    user = await this.userService.setPassword(user._id, hashSync(newPassword));

    if (!user) {
      return null;
    }

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async unsetPassword(user: User | null, oldPassword: string): Promise<User | null> {
    if (!user) {
      return null;
    }

    if (!compareSync(oldPassword, user.saltHash)) {
      return null;
    }

    user = await this.userService.unsetPassword(user._id);

    if (!user) {
      return null;
    }

    user = await this.userService.getUserByID(user._id);

    return user;
  }

  async getUserByID(id: string): Promise<User> {
    const user: User = await this.userService.getUserByID(id);

    return user;
  }

  async findUserByGitHubID(githubID: string): Promise<User | null> {
    const user: User | null = await this.userService.findUserByProvider(ProviderType.GITHUB, githubID);

    return user;
  }

  async findUserByGoogleID(googleID: string): Promise<User | null> {
    const user: User | null = await this.userService.findUserByProvider(ProviderType.GOOGLE, googleID);

    return user;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user: User | null = await this.userService.findUserByUsername(username);

    return user;
  }

  async validateUser(user: User, password: string): Promise<boolean> {
    if (!user.saltHash) {
      return false;
    }

    if (!compareSync(password, user.saltHash)) {
      return false;
    }

    return true;
  }
}
