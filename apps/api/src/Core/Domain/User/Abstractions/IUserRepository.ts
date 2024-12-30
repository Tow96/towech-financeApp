import { User } from '../Entities/user.entity';

export abstract class IUserRepository {
  abstract insert(entity: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
}
