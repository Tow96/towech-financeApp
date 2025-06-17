import { ICategoryRepository } from '../Core/i-category-repository';

export class PostgresCategoryRepository implements ICategoryRepository {
  test(): string {
    return 'pesto';
  }
}
