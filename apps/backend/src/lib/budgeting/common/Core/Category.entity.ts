// External packages
import { v4 as uuidv4 } from 'uuid';

// App packages
import { Entity } from '../../../_common/primitives';

interface CategoryProps {
  userId: string;
  parentId: string | null;
  iconId: number;
  name: string;
  type: CategoryType;
  deletedAt: Date | null;
}

export interface CreateCategoryProps {
  userId: string;
  parentId: string | null;
  iconId: number;
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryProps {
  parentId?: string | null;
  iconId?: number;
  name?: string;
}

export enum CategoryType {
  expense = 'EXPENSE',
  income = 'INCOME',
}

export class CategoryEntity extends Entity<CategoryProps> {
  static create(create: CreateCategoryProps): CategoryEntity {
    const id = uuidv4();
    const props: CategoryProps = { ...create, deletedAt: null };

    return new CategoryEntity({ id, props });
  }

  validate(): void {
    this.props.name = this.props.name.trim();
    if (this.props.name.length === 0) throw new Error('Name cannot be empty');
    if (this.props.name.length > 50) throw new Error('Name cannot be longer than 50 characters');

    if (!Object.values(CategoryType).includes(this.props.type)) throw new Error('Invalid type');
  }

  get type(): CategoryType {
    return this.props.type;
  }
}
