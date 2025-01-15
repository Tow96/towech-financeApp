import { Body, Controller, Delete, Inject, NotFoundException, Param, Post } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../Database/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../Database/Schemas/User.Schema';
import { eq } from 'drizzle-orm';

@Controller('user-new')
export class UserController {
  private readonly _logger = new Logger(UserController.name);
  constructor(@Inject(DATABASE_CONNECTION) private readonly _db: NodePgDatabase<typeof schema>) {}

  @Post('register')
  async registerUser(
    @Body() createUser: { name: string; email: string; password: string }
  ): Promise<string> {
    // TODO: Validate data

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
  }
}
