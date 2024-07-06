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
      ...(password ? {
        saltHash: hashSync(password)
      } : {}),
      accounts: []
    });

    user = await user.save();

    return user;
  }

  async updateUser(userID: string, displayName: string, userName: string, emailAddress: string): Promise<User> {
    const user: User | null = await this.userModel.findOneAndUpdate({
      _id: { $eq: new Types.ObjectId(userID) }
    }, {
      $set: {
        displayName,
        userName,
        emailAddress
      }
    }, {
      new: true
    })
      .exec();

    if (!user) {
      throw new Error('a user with the specified ID could not be found');
    }

    return user;
  }

  async getUserByID(id: string): Promise<User> {
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
      throw new Error('a user with the specified ID could not be found');
    }

    if (users.length > 1) {
      throw new Error('more than one users with the specified ID were found');
    }

    const user: User = users[0];

    return user;
  }

  async findUserByUsername(username: string): Promise<User | null> {
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

    const user: User | null = users[0] || null;

    return user;
  }

  async findUserByProvider(providerType: ProviderType, providerInfo: string): Promise<User | null> {
    const account: Account | null = await this.getAccountByProvider(providerType, providerInfo);

    if (!account) {
      return null;
    }

    const user: User | null = await this.getUserByID((account.user as unknown as Types.ObjectId).toString());

    return user;
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

    if (!account) {
      return null;
    }

    return account;
  }

  async findAccount(providerType: ProviderType, userID: string): Promise<Account | null> {
    const account: Account | null = await this.accountModel
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

    return account;
  }
}
