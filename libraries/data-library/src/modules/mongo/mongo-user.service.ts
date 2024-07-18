import { Injectable } from '@nestjs/common';
import { Account, AccountModel, ProviderType, User, UserModel, UserService } from '@voltron/core-library';
import { hashSync } from 'bcryptjs';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

@Injectable()
export class MongoUserService implements UserService {
  constructor(
    private readonly userModel: UserModel,
    private readonly accountModel: AccountModel
  ) {
  }

  async createUser(displayName: string, userName: string, emailAddress: string, password: string): Promise<User> {
    let user: User = new this.userModel({
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
    const user: User | null = await this.userModel
      .findOneAndUpdate({
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

  async verifyUser(userID: string): Promise<User> {
    const user: User | null = await this.userModel
      .findOneAndUpdate({
        _id: { $eq: new Types.ObjectId(userID) }
      }, {
        $set: {
          verifiedAt: dayjs().toDate()
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

  async linkUserToProvider(userID: string, providerType: ProviderType, providerID: string): Promise<User> {
    let account: Account = new this.accountModel({
      providerType,
      providerID,
      user: new Types.ObjectId(userID)
    });

    let user: User | null = await this.userModel
      .findOne({
        _id: { $eq: new Types.ObjectId(userID) }
      })
      .exec();

    if (!user) {
      throw new Error('a user with the specified ID could not be found');
    }

    user.accounts.push(new Types.ObjectId(account._id));

    account = await account.save();

    user = await user.save();

    user = await this.getUserByID(user._id);

    return user;
  }

  async unlinkUserFromProvider(userID: string, providerType: ProviderType): Promise<User> {
    let user: User | null = await this.userModel
      .findOne({
        _id: { $eq: new Types.ObjectId(userID) }
      })
      .exec();

    if (!user) {
      throw new Error('a user with the specified ID could not be found');
    }

    const account: Account | null = await this.accountModel
      .findOneAndDelete({
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

    if (!account) {
      return user;
    }

    const index: number = user.accounts.indexOf(new Types.ObjectId(account._id));

    if (index !== -1) {
      user.accounts.splice(index, 1);
    }

    user = await user.save();

    user = await this.getUserByID(user._id);

    return user;
  }

  async setPassword(userID: string, saltHash: string): Promise<User> {
    const user: User | null = await this.userModel
      .findOneAndUpdate({
        _id: { $eq: new Types.ObjectId(userID) }
      }, {
        $set: {
          saltHash
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

  async unsetPassword(userID: string): Promise<User> {
    const user: User | null = await this.userModel
      .findOneAndUpdate({
        _id: { $eq: new Types.ObjectId(userID) }
      }, {
        $set: {
          saltHash: null
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

  async findUserByProvider(providerType: ProviderType, providerID: string): Promise<User | null> {
    const account: Account | null = await this.getAccountByProvider(providerType, providerID);

    if (!account) {
      return null;
    }

    const user: User | null = await this.getUserByID((account.user as unknown as Types.ObjectId).toString());

    return user;
  }

  async getAccountByProvider(providerType: ProviderType, providerID: string): Promise<Account | null> {
    const account: Account | null = await this.accountModel
      .findOne<Account>({
        $and: [
          {
            'providerType': { $eq: providerType }
          },
          {
            'providerID': { $eq: providerID }
          }
        ]
      })
      .exec();

    if (!account) {
      return null;
    }

    return account;
  }
}
