import { v4 as uuidV4 } from 'uuid';
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
} from '@nestjs/common';

import { DATABASE_CONNECTION } from '../../Database/drizzle.provider';
import * as schema from '../../Database/Schemas/User.Schema';
import { RegisterUserDto } from '../Validation/RegisterUser.Dto';

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
        passwordHash: createUser.password,
      })
      .returning();
    this._logger.log(`Inserted new user with email "${newUser.email}" and id: ${newUser.id}.`);

    // TODO: Send registration email

    // Return
    return newUser.id;
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
}
