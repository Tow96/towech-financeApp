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

import { DATABASE_CONNECTION } from '../../Database/drizzle.provider';
import * as schema from '../../Database/Schemas';
import { RegisterUserDto } from '../Validation/RegisterUser.Dto';
import { GetUsersDto } from '../Dto/GetUsers.Dto';
import { GetUserDto } from '../Dto/GetUser.Dto';
import { ChangeNameDto } from '../Validation/ChangeName.Dto';

@Controller('user-new')
export class UserController {
  private readonly _logger = new Logger(UserController.name);
  constructor(@Inject(DATABASE_CONNECTION) private readonly _db: NodePgDatabase<typeof schema>) {}

  @Post('register')
  async registerUser(@Body() createUser: RegisterUserDto): Promise<string> {
    // Check if user exists
    const userExists = await this._db.query.UserSchema.findFirst({
      where: eq(schema.UserSchema.email, createUser.email),
    });
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
    const [newUser] = await this._db
      .insert(schema.UserSchema)
      .values({
        id: uuidV4(),
        createdAt: new Date(),
        updatedAt: new Date(0),
        name: createUser.name,
        email: createUser.email,
        emailVerified: false,
        passwordHash: hashedPassword,
      })
      .returning();
    this._logger.log(`Inserted new user with email "${newUser.email}" and id: ${newUser.id}.`);

    // TODO: Send registration email

    // Return
    return newUser.id;
  }

  @Get('')
  async getAllUsers(): Promise<GetUsersDto[]> {
    return this._db
      .select({
        id: schema.UserSchema.id,
        email: schema.UserSchema.email,
        name: schema.UserSchema.name,
      })
      .from(schema.UserSchema);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<GetUserDto> {
    const userQuery = await this._db
      .select({
        id: schema.UserSchema.id,
        email: schema.UserSchema.email,
        name: schema.UserSchema.name,
      })
      .from(schema.UserSchema)
      .where(eq(schema.UserSchema.id, id));

    if (userQuery.length == 0) throw new NotFoundException('User not found.');

    return userQuery[0];
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const userExists = await this._db.query.UserSchema.findFirst({
      where: eq(schema.UserSchema.id, id),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    // Delete user
    await this._db.delete(schema.UserSchema).where(eq(schema.UserSchema.id, id));
    this._logger.log(`Deleted user with id ${id}.`);
  }

  @Patch(':id/name')
  async changeName(@Param('id') id: string, @Body() data: ChangeNameDto): Promise<void> {
    const userExists = await this._db.query.UserSchema.findFirst({
      where: eq(schema.UserSchema.id, id),
    });
    if (!userExists) throw new NotFoundException('User not found.');

    // Update user
    await this._db
      .update(schema.UserSchema)
      .set({ name: data.name, updatedAt: new Date() })
      .where(eq(schema.UserSchema.id, id));

    this._logger.log(`Updated name of user with id ${id}.`);
  }
}
