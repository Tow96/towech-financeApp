// External Packages
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

// App packages
import { CurrentUser } from '../../../users/lib/current-user.decorator';
import { User } from '../../../users/core/user.entity';
import { CommandQueryResult, Result } from '../../../_common/primitives';

// Slice common packages
// Feature packages
import * as commands from './commands';
import * as queries from './queries';

@Controller('wallet')
export class ManageWalletsController {
  private readonly _logger = new Logger(`Distribution.${ManageWalletsController.name}`);

  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus
  ) {}

  @Post()
  async createWallet(
    @CurrentUser() user: User,
    @Body() body: CreateWalletRequest
  ): Promise<CreateWalletResponse> {
    // TODO: Validate inputs

    const command = new commands.CreateWalletCommand(user.id, body.iconId, body.name);
    const result = await this._commandBus.execute(command);

    this.returnFailMessages(result);
    return { id: result.message };
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateWallet(
    @CurrentUser() user: User,
    @Body() body: UpdateWalletRequest,
    @Param('id') id: string
  ): Promise<void> {
    await this.validateWalletOwnership(user.id, id);

    const command = new commands.UpdateWalletCommand(id, body.iconId, body.name);
    const result = await this._commandBus.execute(command);
    this.returnFailMessages(result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiveWallet(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    await this.validateWalletOwnership(user.id, id);

    const command = new commands.ArchiveWalletCommand(id);
    const result = await this._commandBus.execute(command);
    this.returnFailMessages(result);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreWallet(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    await this.validateWalletOwnership(user.id, id);

    const command = new commands.RestoreWalletCommand(id);
    const result = await this._commandBus.execute(command);

    this.returnFailMessages(result);
  }

  private async validateWalletOwnership(userId: string, walletId: string): Promise<void> {
    const ownerQuery = await this._queryBus.execute(new queries.GetWalletOwnerQuery(walletId));
    if (ownerQuery.status === CommandQueryResult.NotFound)
      throw new NotFoundException(ownerQuery.message);
    if (ownerQuery.message !== userId) throw new ForbiddenException();
  }

  private returnFailMessages(result: Result<string>) {
    switch (result.status) {
      case CommandQueryResult.Conflict:
        throw new ConflictException(result.message);
      case CommandQueryResult.NotFound:
        throw new NotFoundException(result.message);
    }
  }
}

interface CreateWalletRequest {
  name: string;
  iconId: number;
}

interface CreateWalletResponse {
  id: string;
}

interface UpdateWalletRequest {
  iconId?: number;
  name?: string;
}
