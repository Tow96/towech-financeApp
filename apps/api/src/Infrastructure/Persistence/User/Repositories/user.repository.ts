import { Injectable } from '@nestjs/common';

import { User } from '../../../../Core/Domain/User/Entities/user.entity';
import { IUserRepository } from '../../../../Core/Domain/User/Abstractions/IUserRepository';

@Injectable()
export class UserRepository extends IUserRepository {
  private users: User[] = [];

  async insert(entity: User): Promise<void> {
    this.users.push(entity);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.Id === id);
    return user ? user : null;
  }
}
