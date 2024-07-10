import { Injectable } from '@nestjs/common';
import { Account, AccountModel, AccountService, ProviderType, User, UserModel } from '@voltron/core-library';
import { Types } from 'mongoose';

@Injectable()
export class MongoAccountService implements AccountService {
  constructor(
    private readonly userModel: UserModel,
    private readonly accountModel: AccountModel
  ) {
  }

  async createAccount(providerType: ProviderType, providerID: string, userID: string): Promise<Account> {
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

    if (user) {
      user.accounts.push(new Types.ObjectId(account._id));

      user = await user.save();
    }

    account = await account.save();

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
