import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUserRepository, User } from '@financeApp/backend-domain';
import { DATABASE_CONNECTION } from '../../Database.Token';
import * as schema from '../Schemas/User.Schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository extends IUserRepository {
  @Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>;
  private readonly logger = new Logger(UserRepository.name);

  async insert(entity: User): Promise<void> {
    try {
      await this.database.insert(schema.userTable).values({
        id: entity.Id,
        createdAt: entity.CreatedAt,
        updatedAt: entity.UpdatedAt,
        name: entity.Name,
        email: entity.Email,
        emailVerified: entity.EmailVerified,
        passwordHash: entity.PasswordHash,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.database.query.userTable.findFirst({
      where: eq(schema.userTable.email, email),
    });

    return !!user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.database.query.userTable.findFirst({
      where: eq(schema.userTable.id, id),
    });

    return !user ? null : User.fromDb(user);
  }
}
