import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateUserCommandUseCase } from '../Core/Application/User/Commands/CreateUser/CreateUserCommand.use-case';
import { GetUserQueryUseCase } from '../Core/Application/User/Queries/GetUser/GetUserQuery.use-case';
import { CreateUserCommandDto } from '../Core/Application/User/Commands/CreateUser/CreateUserCommand.dto';
import { GetUserQuery, GetUserQueryResponse } from '../Core/Application/User/Queries/GetUser/GetUserQuery.dto';

@Controller('pesto')
export class UserController {
  constructor(
    private readonly createUserCommand: CreateUserCommandUseCase,
    private readonly getUserQuery: GetUserQueryUseCase
  ) {}

  @Post('')
  async create(@Body() body: CreateUserCommandDto): Promise<string> {
    return await this.createUserCommand.run(body);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetUserQueryResponse> {
    let query: GetUserQuery = { id };
    return await this.getUserQuery.run(query);
  }
}
