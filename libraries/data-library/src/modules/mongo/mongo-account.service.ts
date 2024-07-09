import { Injectable } from '@nestjs/common';
import { Account, AccountModel, AccountService, ProviderType } from '@voltron/core-library';
import { Types } from 'mongoose';

@Injectable()
export class MongoAccountService implements AccountService {
  constructor(
    private readonly accountModel: AccountModel
  ) {
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
