import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateUserCommand } from '../Core/Application/User/Commands/CreateUser/CreateUser.Command';
import { GetUserQuery } from '../Core/Application/User/Queries/GetUser/GetUser.Query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQueryResponse } from '../Core/Application/User/Queries/GetUser/GetUser.QueryResponse';

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
