import { v4 as uuidV4 } from 'uuid';
import { hash } from '@node-rs/argon2';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

import {
  Body,
  Controller,
  Delete,
  Inject,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
  Patch,
  Get,
  UseGuards,
} from '@nestjs/common';

// Guards
import { AdminCreatorGuard } from '../Guards/AdminCreator.Guard';
import { AdminGuard } from '../Guards/Admin.Guard';
import { RequestingUserGuard } from '../Guards/RequestingUser.Guard';
import { AdminRequestingUserGuard } from '../Guards/AdminUser.Guard';

import { USER_SCHEMA_CONNECTION } from '../../Database/Users.Provider';
import { UsersSchema } from '../../Database/Users.Schema';
import { RegisterUserDto } from '../Validation/RegisterUser.Dto';
import { GetUsersDto } from '../Dto/GetUsers.Dto';
import { GetUserDto } from '../Dto/GetUser.Dto';
import { ChangeNameDto } from '../Validation/ChangeName.Dto';
import { UserInfoModel, UserInfoRepository } from '../../Database/Repositories/UserInfo.Repository';

@Controller('user-new')
export class UserController {
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>,
    private readonly _userInfoRepository: UserInfoRepository
  ) {}

  @Post('/register')
  @UseGuards(AdminCreatorGuard)
  async registerUser(@Body() createUser: RegisterUserDto): Promise<string> {
    // Check if user exists
    const userExists = await this._userInfoRepository.getByEmail(createUser.email);
    if (userExists)
      throw new UnprocessableEntityException(
        `User with email "${createUser.email}" already registered.`
      );

    const hashedPassword = await hash(createUser.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Create user
    const newUser: UserInfoModel = {
      id: uuidV4(),
      createdAt: new Date(),
      updatedAt: new Date(0),
      name: createUser.name,
      email: createUser.email,
      emailVerified: false,
      role: createUser.role === 'admin' ? 'admin' : 'user',
      passwordHash: hashedPassword,
    };
    await this._userInfoRepository.insert(newUser);

    // TODO: Send registration email

    // Return
    return newUser.id;
  }

  @Get('/')
  @UseGuards(AdminGuard)
  async getAllUsers(): Promise<GetUsersDto[]> {
    return this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
      })
      .from(UsersSchema.UserInfoTable);
  }

  @Get('/:userId')
  @UseGuards(RequestingUserGuard)
  async getUser(@Param('userId') userId: string): Promise<GetUserDto> {
    const userQuery = await this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
      })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.id, userId));

    if (userQuery.length == 0) throw new NotFoundException('User not found.');

    return userQuery[0];
  }

  @Delete('/:userId')
  @UseGuards(AdminRequestingUserGuard)
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    const userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    await this._userInfoRepository.delete(userExists);
  }

  @Patch('/:userId/name')
  @UseGuards(RequestingUserGuard)
  async changeName(@Param('userId') userId: string, @Body() data: ChangeNameDto): Promise<void> {
    let userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    // Update user
    userExists = { ...userExists, name: data.name, updatedAt: new Date() };
    await this._userInfoRepository.update(userExists);
  }
}
