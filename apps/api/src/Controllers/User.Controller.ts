import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateUserCommand, GetUserQuery, GetUserQueryResponse } from '@financeApp/backend-application';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('pesto')
export class UserController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post('')
  async create(@Body() body: CreateUserCommand): Promise<string> {
    const command = new CreateUserCommand(body.name, body.email, body.role);
    return await this.commandBus.execute(command);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetUserQueryResponse> {
    const query = new GetUserQuery(id);
    return await this.queryBus.execute(query);
  }
}
