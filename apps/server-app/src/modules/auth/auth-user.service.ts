import { Inject, Injectable } from '@nestjs/common';
import { Account, DataService, ProviderType, User } from '@voltron/core-library';
import { MONGO_CONSTANTS } from '@voltron/data-library';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthUserService {
  constructor(
    @Inject(MONGO_CONSTANTS.Symbols.Services.DataService)
    private readonly dataService: DataService
  ) {
  }

  async registerUser(displayName: string, userName: string, emailAddress: string, password: string): Promise<User> {
    let user: User | null = null;

    if (!user) {
      user = await this.dataService.findUserByUsername(emailAddress);

      if (user) {
        throw new Error('a user with that email address is already registered');
      }
    }

    if (!user) {
      user = await this.dataService.findUserByUsername(userName);

      if (user) {
        throw new Error('a user with that user name is already registered');
      }
    }

    user = await this.dataService.createUser(displayName, userName, emailAddress, password);

    return user;
  }

  async updateUser(user: User | null, displayName: string, userName: string): Promise<User | null> {
    if (!user) {
      return null;
    }

    user = await this.dataService.updateUser(user._id, displayName, userName, user.emailAddress);

    if (!user) {
      return null;
    }

    user = await this.dataService.getUserByID(user._id);

    return user;
  }

  async getUserByID(id: string): Promise<User> {
    const user: User = await this.dataService.getUserByID(id);

    return user;
  }

  async findUserByGitHubID(githubID: string): Promise<User | null> {
    const user: User | null = await this.dataService.findUserByProvider(ProviderType.GITHUB, githubID);

    return user;
  }

  async findUserByGoogleID(googleID: string): Promise<User | null> {
    const user: User | null = await this.dataService.findUserByProvider(ProviderType.GOOGLE, googleID);

    return user;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user: User | null = await this.dataService.findUserByUsername(username);

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
