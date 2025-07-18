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

import * as commands from './commands';
import * as queries from './queries';
import { SummaryItem } from '../../common/movements/core';
import { GetMovementOwnerQuery } from './queries';

@Controller('movement')
export class ManageMovementsController {
  private readonly _logger = new Logger(`Distribution.${ManageMovementsController.name}`);

  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus
  ) {}

  @Post()
  async createMovement(
    @CurrentUser() user: User,
    @Body() body: CreateMovementRequest
  ): Promise<CreateMovementResponse> {
    // TODO: Validate inputs

    const summary = body.summary.map(
      i =>
        new SummaryItem({
          amount: i.amount,
          destinationWalletId: i.destinationWalletId,
          originWalletId: i.originWalletId,
        })
    );
    const command = new commands.CreateMovementCommand(
      user.id,
      body.categoryId,
      body.subCategoryId,
      body.description,
      body.date,
      summary
    );
    const result = await this._commandBus.execute(command);

    this.returnFailMessages(result);
    return { id: result.message };
  }

  @Put(':id')
  async updateMovement(
    @CurrentUser() user: User,
    @Body() body: UpdateMovementRequest,
    @Param('id') id: string
  ): Promise<void> {
    await this.validateMovementOwnership(user.id, id);

    const summary = body.summary?.map(
      i =>
        new SummaryItem({
          amount: i.amount,
          destinationWalletId: i.destinationWalletId,
          originWalletId: i.originWalletId,
        })
    );

    const command = new commands.UpdateMovementCommand(
      id,
      body.categoryId,
      body.subCategoryId,
      body.description,
      body.date,
      summary
    );
  }

  private returnFailMessages(result: Result<string>) {
    switch (result.status) {
      case CommandQueryResult.Conflict:
        throw new ConflictException(result.message);
      case CommandQueryResult.NotFound:
        throw new NotFoundException(result.message);
    }
  }

  private async validateMovementOwnership(userId: string, movementId: string): Promise<void> {
    const query = new queries.GetMovementOwnerQuery(movementId);
    const ownerQuery = await this._queryBus.execute(query);
    if (ownerQuery.status === CommandQueryResult.NotFound)
      throw new NotFoundException(ownerQuery.message);
    if (ownerQuery.message !== userId) throw new ForbiddenException();
  }
}

interface summaryRequest {
  originWalletId: string;
  destinationWalletId: string;
  amount: number;
}

interface CreateMovementRequest {
  categoryId: string;
  subCategoryId: string | null;
  description: string;
  date: Date;
  summary: summaryRequest[];
}

interface CreateMovementResponse {
  id: string;
}

interface UpdateMovementRequest {
  categoryId?: string;
  subCategoryId?: string | null;
  description?: string;
  date?: Date;
  summary?: summaryRequest[];
}
