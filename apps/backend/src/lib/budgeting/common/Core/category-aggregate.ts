import { v4 as uuidV4 } from 'uuid';
import { AggregateRoot } from '../../../_common/primitives/aggregate-root.base';
import {
  CategoryArchivedEvent,
  CategoryCreatedEvent,
  CategoryRestoredEvent,
  CategoryUpdatedEvent,
} from './category-events';
import {
  CreateSubCategoryProps,
  SubCategoryEntity,
  UpdateSubCategoryProps,
} from './subcategory-entity';
import {
  SubCategoryCreatedEvent,
  SubCategoryRemovedEvent,
  SubCategoryUpdatedEvent,
} from './subcategory-events';

export enum CategoryType {
  income = 'INCOME',
  expense = 'EXPENSE',
}

interface CategoryProps {
  userId: string;
  iconId: number;
  name: string;
  type: CategoryType;
  subCategories: SubCategoryEntity[];
  deletedAt: Date | null;
}

interface CreateCategoryProps {
  userId: string;
  iconId: number;
  name: string;
  type: CategoryType;
}

interface UpdateCategoryProps {
  iconId?: number;
  name?: string;
}

export class CategoryAggregate extends AggregateRoot<CategoryProps> {
  private readonly MAX_SUBCATEGORY_COUNT = 10;

  static create(create: CreateCategoryProps): CategoryAggregate {
    const id = uuidV4();
    const props: CategoryProps = { ...create, subCategories: [], deletedAt: null };

    const category: CategoryAggregate = new CategoryAggregate({ id, props });

    category.addEvent(
      new CategoryCreatedEvent({
        aggregateId: id,
        name: props.name,
        type: props.type,
        userId: props.userId,
      })
    );

    return category;
  }

  validate(): void {
    this.props.name = this.props.name.trim().toLowerCase();
    if (this.props.name.length < 2) throw new Error('name must be at least 3 characters');
    if (this.props.name.length > 50) throw new Error('name cannot be longer than 50 characters');
  }

  get userId() {
    return this.props.userId;
  }

  get type() {
    return this.props.type;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  update(update: UpdateCategoryProps): void {
    if (update.iconId) this.props.iconId = update.iconId;
    if (update.name) this.props.name = update.name;
    this._updatedAt = new Date();
    this.validate();

    this.addEvent(
      new CategoryUpdatedEvent({
        aggregateId: this._id,
        name: this.props.name,
        type: this.props.type,
      })
    );
  }

  archive(): void {
    if (this.props.deletedAt !== null) return;

    this.props.deletedAt = new Date();
    this.addEvent(new CategoryArchivedEvent({ aggregateId: this._id }));
  }

  restore(): void {
    if (this.props.deletedAt === null) return;

    this.props.deletedAt = null;
    this.addEvent(new CategoryRestoredEvent({ aggregateId: this._id }));
  }

  addSubCategory(create: CreateSubCategoryProps): string {
    if (this.props.subCategories.length >= this.MAX_SUBCATEGORY_COUNT)
      throw new Error('A Category can only have 10 subcategories');
    if (
      this.props.subCategories.filter(s => s.name === create.name.trim().toLowerCase()).length > 0
    )
      throw new Error('SubCategory with same name already exists');

    const subCategory = SubCategoryEntity.create(create);

    this.props.subCategories.push(subCategory);
    this.addEvent(
      new SubCategoryCreatedEvent({
        aggregateId: this._id,
        userId: this.props.userId,
        categoryId: subCategory.id,
        name: subCategory.name,
        type: this.props.type,
      })
    );

    return subCategory.id;
  }

  removeSubCategory(id: string) {
    this.props.subCategories = this.props.subCategories.filter(
      subCategory => subCategory.id !== id
    );

    this.addEvent(
      new SubCategoryRemovedEvent({
        aggregateId: this._id,
        categoryId: id,
      })
    );
  }

  updateSubCategory(id: string, update: UpdateSubCategoryProps): void {
    const subCategory = this.props.subCategories.find(s => s.id === id);
    if (!subCategory) return;

    if (
      update.name &&
      this.props.subCategories.filter(s => s.name === update.name.trim().toLowerCase()).length > 0
    )
      throw new Error('SubCategory with same name already exists');

    subCategory.update(update);
    this.addEvent(
      new SubCategoryUpdatedEvent({
        aggregateId: this._id,
        categoryId: id,
        name: subCategory.name,
        type: this.props.type,
      })
    );
  }
}
