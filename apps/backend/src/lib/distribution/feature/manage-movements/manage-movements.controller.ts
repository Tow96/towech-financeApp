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
import { SummaryItem } from '../../common/movements/core';

@Controller('movement')
export class ManageMovementsController {
  private readonly _logger = new Logger(`Distribution.${ManageMovementsController.name}`);

  constructor(private readonly _commandBus: CommandBus) {}

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

  private returnFailMessages(result: Result<string>) {
    switch (result.status) {
      case CommandQueryResult.Conflict:
        throw new ConflictException(result.message);
      case CommandQueryResult.NotFound:
        throw new NotFoundException(result.message);
    }
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
