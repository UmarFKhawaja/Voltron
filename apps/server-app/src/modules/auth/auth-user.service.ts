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
      user = await this.dataService.findUser(emailAddress);

      if (user) {
        throw new Error('a user is already registered with that email address');
      }
    }

    if (!user) {
      user = await this.dataService.findUser(userName);

      if (user) {
        throw new Error('a user is already registered with that user name');
      }
    }

    user = await this.dataService.createUser(displayName, userName, emailAddress, password);

    return user;
  }

  async getUserByID(id: string): Promise<User | null> {
    const user: User | null = await this.dataService.getUserByID(id);

    return user;
  }

  async getUserByGitHubID(githubID: string): Promise<User | null> {
    const user: User | null = await this.dataService.getUserByProvider(ProviderType.GITHUB, githubID);

    return user;
  }

  async getUserByGoogleID(googleID: string): Promise<User | null> {
    const user: User | null = await this.dataService.getUserByProvider(ProviderType.GOOGLE, googleID);

    return user;
  }

  async identifyUser(username: string): Promise<User | null> {
    const user: User | null = await this.dataService.findUser(username);

    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user: User | null = await this.dataService.findUser(username);

    if (!user) {
      return null;
    }

    const account: Account | null = user.accounts
      .map((account) => account as unknown as Account)
      .filter((account: Account): boolean => account.providerType === ProviderType.LOCAL)
      .shift() || null;

    if (!account) {
      return null;
    }

    if (!compareSync(password, account.providerInfo)) {
      return null;
    }

    return user;
  }

  async updateUser(user: User | null, displayName: string, userName: string): Promise<User | null> {
    if (!user) {
      return null;
    }

    user = await this.dataService.updateUser(user._id, displayName, userName);

    if (!user) {
      return null;
    }

    user = await this.dataService.getUserByID(user._id);

    return user;
  }
}
