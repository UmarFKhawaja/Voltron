import { Injectable } from '@nestjs/common';
import { Account, AccountModel, DataService, ProviderType, User, UserModel } from '@voltron/core-library';
import { hashSync } from 'bcryptjs';
import { Types } from 'mongoose';

@Injectable()
export class MongoDataService implements DataService {
  constructor(
    private readonly userModel: UserModel,
    private readonly accountModel: AccountModel
  ) {
  }

  async createUser(displayName: string, userName: string, emailAddress: string, password: string): Promise<User> {
    let user = new this.userModel({
      displayName,
      userName,
      emailAddress,
      accounts: []
    });

    if (password) {
      let account = new this.accountModel({
        providerType: ProviderType.LOCAL,
        providerInfo: hashSync(password),
        user: user.id
      });

      account = await account.save();

      user.accounts.push(account.id);
    }

    user = await user.save();
    user = user.toJSON();

    return user as User;
  }

  async getUserByID(id: string): Promise<User | null> {
    const users: User[] = await this.userModel
      .aggregate<User>([
        {
          $match: {
            _id: { $eq: new Types.ObjectId(id) }
          }
        },
        {
          $lookup: {
            from: 'accounts',
            foreignField: '_id',
            localField: 'accounts',
            as: 'accounts'
          }
        }
      ])
      .exec();

    if (users.length === 0) {
      return null;
    }

    if (users.length > 1) {
      throw new Error();
    }

    return users[0];
  }

  async getAccountByProvider(providerType: ProviderType, providerInfo: string): Promise<Account | null> {
    const account: Account | null = await this.accountModel
      .findOne<Account>({
        $and: [
          {
            'providerType': { $eq: providerType }
          },
          {
            'providerInfo': { $eq: providerInfo }
          }
        ]
      })
      .exec();

    return account;
  }

  async getUserByProvider(providerType: ProviderType, providerInfo: string): Promise<User | null> {
    const account: Account | null = await this.getAccountByProvider(providerType, providerInfo);

    if (!account) {
      return null;
    }

    const user: User | null = await this.getUserByID((account.user as unknown as Types.ObjectId).toString());

    return user;
  }

  async findUser(username: string): Promise<User | null> {
    const users: User[] = await this.userModel
      .aggregate<User>([
        {
          $match: {
            $or: [
              {
                userName: { $eq: username }
              },
              {
                emailAddress: { $eq: username }
              }
            ]
          }
        },
        {
          $lookup: {
            from: 'accounts',
            foreignField: '_id',
            localField: 'accounts',
            as: 'accounts'
          }
        }
      ])
      .exec();

    if (users.length === 0) {
      return null;
    }

    return users[0];
  }

  async findAccount(providerType: ProviderType, userID: string): Promise<Account | null> {
    return await this.accountModel
      .findOne<Account>({
        $and: [
          {
            providerType: { $eq: providerType }
          },
          {
            user: { $eq: new Types.ObjectId(userID) }
          }
        ]
      })
      .exec();
  }
}
