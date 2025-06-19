import { v4 as uuidV4 } from 'uuid';
import { AggregateRoot } from '../../../_common/primitives/aggregate-root.base';
import { CategoryCreatedEvent } from './category-events';

export enum CategoryType {
  income = 'INCOME',
  expense = 'EXPENSE',
}

interface CategoryProps {
  userId: string;
  iconId: number;
  name: string;
  type: CategoryType;
  deletedAt: Date | null;
}

interface CreateCategoryProps {
  userId: string;
  iconId: number;
  name: string;
  type: CategoryType;
}

export class CategoryAggregate extends AggregateRoot<CategoryProps> {
  static create(create: CreateCategoryProps, fromDb: boolean = false): CategoryAggregate {
    const id = uuidV4();
    const props: CategoryProps = { ...create, deletedAt: null };

    const category: CategoryAggregate = new CategoryAggregate({ id, props });

    if (!fromDb) {
      category.addEvent(
        new CategoryCreatedEvent({
          aggregateId: id,
          name: props.name,
          type: props.type,
          userId: props.userId,
        })
      );
    }

    return category;
  }

  validate(): void {
    this.props.name = this.props.name.trim().toLowerCase();
    if (this.props.name.length < 2) throw new Error('name must be at least 3 characters');
    if (this.props.name.length > 50) throw new Error('name cannot be longer than 50 characters');
  }
}
