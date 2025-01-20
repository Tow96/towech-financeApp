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
  Logger,
  UnprocessableEntityException,
  Patch,
  Get,
} from '@nestjs/common';

import { USER_SCHEMA_CONNECTION } from '../../Database/Users.Provider';
import { UsersSchema } from '../../Database/Users.Schema';
import { RegisterUserDto } from '../Validation/RegisterUser.Dto';
import { GetUsersDto } from '../Dto/GetUsers.Dto';
import { GetUserDto } from '../Dto/GetUser.Dto';
import { ChangeNameDto } from '../Validation/ChangeName.Dto';
import { UserInfoModel, UserInfoRepository } from '../../Database/Repositories/UserInfo.Repository';

@Controller('user-new')
export class UserController {
  private readonly _logger = new Logger(UserController.name);
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>,
    private readonly _userInfoRepository: UserInfoRepository
  ) {}

  @Post('/register')
  // TODO: Admin/Master guard
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
      passwordHash: hashedPassword,
    };
    await this._userInfoRepository.insert(newUser);

    // TODO: Send registration email

    // Return
    return newUser.id;
  }

  @Get('/')
  // TODO: admin guard
  async getAllUsers(): Promise<GetUsersDto[]> {
    return this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
      })
      .from(UsersSchema.UserInfoTable);
  }

  @Get('/:id')
  // TODO: user guard
  async getUser(@Param('id') id: string): Promise<GetUserDto> {
    const userQuery = await this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
      })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.id, id));

    if (userQuery.length == 0) throw new NotFoundException('User not found.');

    return userQuery[0];
  }

  @Delete('/:id')
  // TODO: user/admin/master guard
  async deleteUser(@Param('id') id: string): Promise<void> {
    const userExists = await this._userInfoRepository.getById(id);
    if (!userExists) throw new NotFoundException('User not found.');

    await this._userInfoRepository.delete(userExists);
  }

  @Patch('/:id/name')
  // TODO: user guard
  async changeName(@Param('id') id: string, @Body() data: ChangeNameDto): Promise<void> {
    let userExists = await this._userInfoRepository.getById(id);
    if (!userExists) throw new NotFoundException('User not found.');

    // Update user
    userExists = { ...userExists, name: data.name, updatedAt: new Date() };
    await this._userInfoRepository.update(userExists);
  }
}
