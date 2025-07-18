import { Controller, Get, Logger } from '@nestjs/common';

import { CurrentUser } from '@/lib/users';
import { WalletRepository } from './repository';
import { WalletDto } from './dto';
import { User } from '@clerk/backend';

@Controller('wallet')
export class WalletController {
  private readonly logger: Logger = new Logger(WalletController.name);

  constructor(private readonly _walletRepository: WalletRepository) {}

  @Get()
  async getAllWallets(@CurrentUser() user: User): Promise<WalletDto[]> {
    this.logger.log(`user: ${user.id} requesting all wallets`);

    const query = await this._walletRepository.getAllUserWallets(user.id);
    return query.map(i => ({
      id: i.id,
      iconId: i.iconId,
      name: i.name,
      money: 0,
      archived: !!i.archivedAt,
    }));
  }
}
