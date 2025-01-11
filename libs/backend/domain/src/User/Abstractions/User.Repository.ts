import { User } from '../Entities/User.Entity';

export abstract class IUserRepository {
  abstract insert(entity: User): Promise<void>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract findById(id: string): Promise<User | null>;
}
