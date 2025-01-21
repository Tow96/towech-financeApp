import { Body, Controller, Delete, Param, Post, Patch, Get, UseGuards } from '@nestjs/common';

// Guards
import { AdminCreatorGuard } from '../Guards/AdminCreator.Guard';
import { AdminGuard } from '../Guards/Admin.Guard';
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

import { RegisterUserDto } from '../Validation/RegisterUser.Dto';
import { ChangeNameDto } from '../Validation/ChangeName.Dto';
import { GetUserDto, GetUsersDto, UserInfoService } from '../../Core/Application/UserInfo.Service';

@Controller('user-new')
export class UserController {
  constructor(private readonly _userInfoService: UserInfoService) {}

  @Post('/register')
  @UseGuards(AdminCreatorGuard)
  async registerUser(@Body() createUser: RegisterUserDto): Promise<string> {
    const newUserId = await this._userInfoService.registerUser(
      createUser.name,
      createUser.email,
      createUser.password,
      createUser.role
    );

    // TODO: Send registration email

    // Return
    return newUserId;
  }

  @Get('/')
  @UseGuards(AdminGuard)
  async getAllUsers(): Promise<GetUsersDto[]> {
    return this._userInfoService.getAllUsers();
  }

  @Get('/:userId')
  @UseGuards(RequestingUserGuard)
  async getUser(@Param('userId') userId: string): Promise<GetUserDto> {
    return this._userInfoService.getUser(userId);
  }

  @Delete('/:userId')
  @UseGuards(AdminRequestingUserGuard)
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return this._userInfoService.deleteUser(userId);
  }

  @Patch('/:userId/name')
  @UseGuards(RequestingUserGuard)
  async changeName(@Param('userId') userId: string, @Body() data: ChangeNameDto): Promise<void> {
    return this._userInfoService.changeName(userId, data.name);
  }
}
// 126
