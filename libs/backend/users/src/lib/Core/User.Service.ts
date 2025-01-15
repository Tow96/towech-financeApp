import { Injectable, Inject, Logger, UnprocessableEntityException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../Database/Schemas/User.Schema';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../Database/drizzle.provider';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class UserService {
  private readonly _logger = new Logger(UserService.name);
  constructor(@Inject(DATABASE_CONNECTION) private _db: NodePgDatabase<typeof schema>) {}

  async registerUser(name: string, email: string, password: string): Promise<string> {
    // Check if user exists
    const userExists = await this._db.query.UserSchema.findFirst({
      where: eq(schema.UserSchema.email, email),
    });
    if (userExists)
      throw new UnprocessableEntityException(`User with email "${email}" already registered.`);

    // Create user
    const [newUser] = await this._db
      .insert(schema.UserSchema)
      .values({
        id: uuidV4(),
        createdAt: new Date(),
        updatedAt: new Date(0),
        name: name,
        email: email,
        emailVerified: false,
        passwordHash: password, // TODO: Hash password
      })
      .returning();
    this._logger.log(`Inserted user with new id: ${newUser.id}`);

    // Send registration email
    this._logger.log(`TODO: Send registration email`);

    // Return
    return newUser.id;
  }
}
