import { CategoryEntity } from './Category.entity';

export abstract class ICategoryRepository {
  abstract categoryExists(userId: string, name: string): Promise<boolean>;

  abstract getAll(userId: string): Promise<CategoryEntity[]>;
  abstract getById(id: string): Promise<CategoryEntity | null>;

  abstract insertEntity(entity: CategoryEntity): Promise<string>;
  abstract updateEntity(entity: CategoryEntity): Promise<void>;
  abstract deleteEntity(id: string): Promise<void>;
}
