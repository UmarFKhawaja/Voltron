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

  async getUser(id: string): Promise<User | null> {
    return await this.userModel
      .findOne<User>({
          _id: { $eq: new Types.ObjectId(id) }
        }
      )
      .exec();
  }

  async findUser(username: string): Promise<User | null> {
    return await this.userModel
      .findOne<User>({
        $or: [
          {
            userName: { $eq: username }
          },
          {
            emailAddress: { $eq: username }
          }
        ]
      })
      .exec();
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
