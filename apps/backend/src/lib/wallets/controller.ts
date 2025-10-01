import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '@/lib/users';
import { WalletRepository } from './repository';
import { AddWalletDto, EditWalletDto, WalletDto } from './dto';
import { User } from '@clerk/backend';

@Controller('wallet')
export class WalletController {
  private readonly logger: Logger = new Logger(WalletController.name);

  constructor(private readonly _walletRepository: WalletRepository) {}

  @Get()
  getAllWallets(@CurrentUser() user: User): Promise<WalletDto[]> {
    this.logger.log(`user: ${user.id} requesting all wallets`);

    return this._walletRepository.getAllUserWallets(user.id);
  }

  @Post()
  async addWallet(@CurrentUser() user: User, @Body() data: AddWalletDto): Promise<{ id: string }> {
    data.name = data.name.trim().toLowerCase();

    this.logger.log(`user: ${user.id} trying to add wallet: ${data.name}`);

    const existingWallet = await this._walletRepository.getWalletIdByName(user.id, data.name);
    if (existingWallet !== null) throw new ConflictException(`Wallet ${data.name} already exists`);

    const id = await this._walletRepository.insertWallet(user.id, data.iconId, data.name);
    return { id };
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async editWallet(
    @CurrentUser() user: User,
    @Body() data: EditWalletDto,
    @Param('id') id: string
  ): Promise<void> {
    data.name = data.name.trim().toLowerCase();

    const wallet = await this._walletRepository.getWalletById(id);
    if (wallet === null || wallet.userId !== user.id)
      throw new NotFoundException(`Wallet ${id} not found`);

    this.logger.log(`user: ${user.id} trying to edit wallet: ${id}`);
    const existingWallet = await this._walletRepository.getWalletIdByName(user.id, data.name);
    if (existingWallet !== null && existingWallet !== wallet.id)
      throw new ConflictException(`Wallet ${data.name} already exists`);

    await this._walletRepository.updateWallet(id, { name: data.name, iconId: data.iconId });
  }

  @Put(':id/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiveWallet(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query('restore') restoreQuery: string
  ): Promise<void> {
    const restore = restoreQuery === '1';
    const wallet = await this._walletRepository.getWalletById(id);
    if (wallet === null || wallet.userId !== user.id)
      throw new NotFoundException(`Wallet ${id} not found`);

    this.logger.log(`user: ${user.id} trying to ${restore ? 'restore' : 'archive'} wallet: ${id}`);
    await this._walletRepository.updateWallet(id, { archivedAt: restore ? null : new Date() });
  }
}
