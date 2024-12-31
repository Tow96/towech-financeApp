import { User } from '../Entities/User.Entity';

export abstract class IUserRepository {
  abstract insert(entity: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
}
