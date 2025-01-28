import { Body, Controller, Delete, Param, Post, Patch, Get, UseGuards } from '@nestjs/common';

// Guards
import { AdminCreatorGuard } from '../Guards/AdminCreator.Guard';
import { AdminGuard } from '../Guards/Admin.Guard';
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

// Services
import { GetUserDto, GetUsersDto, UserQueries } from '../../Core/Application/Queries/User.Queries';
import { UserInfoCommands } from '../../Core/Application/Commands/UserInfo.Commands';

// Validation
import { RegisterUserDto } from '../Validation/RegisterUser.Dto';
import { UpdateUserDto } from '../Validation/UpdateUser.Dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly _userQueries: UserQueries,
    private readonly _userInfoCommands: UserInfoCommands
  ) {}

  @Post('/register')
  @UseGuards(AdminCreatorGuard)
  async registerUser(@Body() createUser: RegisterUserDto): Promise<string> {
    return this._userInfoCommands.register(
      createUser.name,
      createUser.email,
      createUser.password,
      createUser.role
    );
  }

  @Get('/')
  @UseGuards(AdminGuard)
  async getAllUsers(): Promise<GetUsersDto[]> {
    return this._userQueries.getAll();
  }

  @Get('/:userId')
  @UseGuards(RequestingUserGuard)
  async getUser(@Param('userId') userId: string): Promise<GetUserDto> {
    return this._userQueries.get(userId);
  }

  @Delete('/:userId')
  @UseGuards(AdminRequestingUserGuard)
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return this._userInfoCommands.delete(userId);
  }

  @Patch('/:userId')
  @UseGuards(RequestingUserGuard)
  async changeName(@Param('userId') userId: string, @Body() data: UpdateUserDto): Promise<void> {
    return this._userInfoCommands.update(userId, data.name);
  }
}
