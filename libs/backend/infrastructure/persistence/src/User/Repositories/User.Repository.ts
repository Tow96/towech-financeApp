import { Injectable, Logger } from '@nestjs/common';
import { IUserRepository, User } from '@financeApp/backend-domain';

@Injectable()
export class UserRepository extends IUserRepository {
  private users: User[] = [];
  private readonly logger = new Logger(UserRepository.name);

  async insert(entity: User): Promise<void> {
    this.users.push(entity);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.Id === id);
    return user ? user : null;
  }
}
