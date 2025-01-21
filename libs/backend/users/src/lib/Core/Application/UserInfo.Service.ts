import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { v4 as uuidV4 } from 'uuid';
import { hash, verify } from '@node-rs/argon2';

import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { USER_SCHEMA_CONNECTION } from '../../Database/Users.Provider';
import { UsersSchema } from '../../Database/Users.Schema';
import { UserInfoModel, UserInfoRepository } from '../../Database/Repositories/UserInfo.Repository';

export type GetUserDto = {
  id: string;
  email: string;
  name: string;
};

export type GetUsersDto = {
  id: string;
  email: string;
  name: string;
};

@Injectable()
export class UserInfoService {
  constructor(
    @Inject(USER_SCHEMA_CONNECTION) private readonly _db: NodePgDatabase<typeof UsersSchema>,
    private readonly _userInfoRepository: UserInfoRepository
  ) {}

  // Queries --------------------------------------------------------------------------------------
  async getUser(userId: string): Promise<GetUserDto> {
    const [data] = await this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
      })
      .from(UsersSchema.UserInfoTable)
      .where(eq(UsersSchema.UserInfoTable.id, userId));

    if (!data) throw new NotFoundException('User not found');
    return data;
  }

  async getAllUsers(): Promise<GetUsersDto[]> {
    return this._db
      .select({
        id: UsersSchema.UserInfoTable.id,
        email: UsersSchema.UserInfoTable.email,
        name: UsersSchema.UserInfoTable.name,
      })
      .from(UsersSchema.UserInfoTable);
  }

  // Commands -------------------------------------------------------------------------------------
  private hashPassword(password: string): Promise<string> {
    return hash(password, { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 });
  }

  async changeName(userId: string, name: string): Promise<void> {
    // Input validation
    let userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    // Data manipulation
    userExists = { ...userExists, name: name, updatedAt: new Date() };
    await this._userInfoRepository.update(userExists);
  }

  async deleteUser(userId: string): Promise<void> {
    // Input validation
    const userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    // DB manipulation
    await this._userInfoRepository.delete(userExists);
  }

  async registerUser(name: string, email: string, password: string, role: string): Promise<string> {
    // TODO: Validate inputs

    // Check if user exists
    const userExists = await this._userInfoRepository.getByEmail(email);
    if (userExists)
      throw new UnprocessableEntityException(`User with email "${email}" already registered.`);

    // User creation
    const newUser: UserInfoModel = {
      id: uuidV4(),
      createdAt: new Date(),
      updatedAt: new Date(0),
      name: name,
      email: email,
      emailVerified: false,
      role: role === 'admin' ? 'admin' : 'user',
      passwordHash: await this.hashPassword(password),
    };

    // DB manipulation
    await this._userInfoRepository.insert(newUser);
    return newUser.id;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    let userExists = await this._userInfoRepository.getById(userId);
    if (!userExists) throw new NotFoundException('User not found.');

    // Validate old password
    if (!(await verify(userExists.passwordHash, oldPassword)))
      throw new UnprocessableEntityException('Invalid password');

    // Update user
    userExists = {
      ...userExists,
      passwordHash: await this.hashPassword(newPassword),
      updatedAt: new Date(),
    };
    await this._userInfoRepository.update(userExists);
  }
}
