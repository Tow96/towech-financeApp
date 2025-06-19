import { CategoryAggregate } from './category-aggregate';

export abstract class ICategoryRepository {
  abstract categoryExists(userId: string, name: string): Promise<boolean>;

  abstract getAll(userId: string): Promise<CategoryAggregate[]>;
  abstract getById(id: string): Promise<CategoryAggregate | null>;

  abstract saveChanges(aggregate: CategoryAggregate): Promise<void>;
}
