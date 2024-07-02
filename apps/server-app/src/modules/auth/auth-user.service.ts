import { Injectable } from '@nestjs/common';
import { Account, ProviderType, User } from '@voltron/data-library';
import { compareSync, hashSync } from 'bcryptjs';
import dayjs from 'dayjs';
import { v4 as generateUUID } from 'uuid';

@Injectable()
export class AuthUserService {
  private users: Record<string, User>;

  constructor() {
    this.users = {
      umarfkhawaja: {
        id: generateUUID(),
        displayName: 'Umar F Khawaja',
        userName: 'umarfkhawaja',
        emailAddress: 'umar.farooq.khawaja@gmail.com',
        createdAt: dayjs('2014-06-25').toDate(),
        updatedAt: dayjs('2018-12-31').toDate(),
        accounts: [
          {
            id: generateUUID(),
            providerType: ProviderType.LOCAL,
            providerInfo: hashSync('Password1234')
          }
        ]
      },
      beenishsarwar: {
        id: generateUUID(),
        displayName: 'Beenish Sarwar',
        userName: 'beenishsawrwar',
        emailAddress: 'beenish.sarwar@mailinator.com',
        createdAt: dayjs('2019-08-04').toDate(),
        updatedAt: dayjs('2021-11-27').toDate(),
        accounts: []
      }
    };
  }

  async registerUser(displayName: string, userName: string, emailAddress: string, password: string): Promise<User> {
    const executedAt: Date = dayjs().toDate();

    let user: User | null = null;

    if (!user) {
      user = await this.findOne(emailAddress);

      if (user) {
        return user;
      }
    }

    if (!user) {
      user = await this.findOne(userName);

      if (user) {
        return user;
      }
    }

    this.users[userName] = {
      id: generateUUID(),
      displayName,
      userName,
      emailAddress,
      createdAt: executedAt,
      updatedAt: executedAt,
      accounts: [
        ...(!!password ? [
          {
            id: generateUUID(),
            providerType: ProviderType.LOCAL,
            providerInfo: hashSync(password)
          }
        ] : [])
      ]
    };

    return this.users[userName];
  }

  async getUser(id: string): Promise<User | null> {
    const user: User | null = await this.getOne(id);

    return user;
  }

  async identifyUser(username: string): Promise<User | null> {
    const user: User | null = await this.findOne(username);

    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user: User | null = await this.findOne(username);

    if (!user) {
      return null;
    }

    const account: Account | null = user.accounts.find((account: Account): boolean => account.providerType === ProviderType.LOCAL) ?? null;

    if (!account) {
      return null;
    }

    if (!compareSync(password, account.providerInfo)) {
      return null;
    }

    const { accounts, ...result } = user;

    return { ...result, accounts: [] };
  }

  private async getOne(id: string): Promise<User | null> {
    return Object.values(this.users).find((user: User): boolean => user.id === id) ?? null;
  }

  private async findOne(username: string): Promise<User | null> {
    return this.users[username] ?? Object.values(this.users).find((user: User): boolean => user.emailAddress === username) ?? null;
  }
}
