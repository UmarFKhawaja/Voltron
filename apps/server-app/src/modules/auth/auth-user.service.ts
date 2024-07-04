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

  async getUser(id: string): Promise<User | null> {
    const user: User | null = await this.dataService.getUser(id);

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

    const account: Account | null = await this.dataService.findAccount(ProviderType.LOCAL, user.id);

    if (!account) {
      return null;
    }

    if (!compareSync(password, account.providerInfo)) {
      return null;
    }

    return user;
  }
}
