import { Body, Controller, Delete, Param, Post, Patch, Get, UseGuards } from '@nestjs/common';

// Guards
import { AdminCreatorGuard } from '../Guards/AdminCreator.Guard';
import { AdminGuard } from '../Guards/Admin.Guard';
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

// Services
import { UserService } from '../../Core/Application/User.Service';

// Validation
import { RegisterUserDto } from '../Validation/RegisterUser.Dto';
import { ChangeNameDto } from '../Validation/ChangeName.Dto';

@Controller('user-new')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('/register')
  @UseGuards(AdminCreatorGuard)
  async registerUser(@Body() createUser: RegisterUserDto): Promise<string> {
    return this._userService.register(
      createUser.name,
      createUser.email,
      createUser.password,
      createUser.role
    );
  }

  @Get('/')
  @UseGuards(AdminGuard)
  async getAllUsers(): Promise<{ id: string; email: string; name: string }[]> {
    return this._userService.getAll();
  }

  @Get('/:userId')
  @UseGuards(RequestingUserGuard)
  async getUser(
    @Param('userId') userId: string
  ): Promise<{ id: string; email: string; name: string }> {
    return this._userService.get(userId);
  }

  @Delete('/:userId')
  @UseGuards(AdminRequestingUserGuard)
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return this._userService.delete(userId);
  }

  @Patch('/:userId/name')
  @UseGuards(RequestingUserGuard)
  async changeName(@Param('userId') userId: string, @Body() data: ChangeNameDto): Promise<void> {
    return this._userService.changeName(userId, data.name);
  }
}
