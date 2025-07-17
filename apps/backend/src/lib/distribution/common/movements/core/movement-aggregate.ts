// External packages
import { v4 as uuidV4 } from 'uuid';

// App packages
import { CategoryAggregate, CategoryType } from '../../../../_common/categories';
import { AggregateRoot } from '../../../../_common/primitives';

// Slice packages
import * as events from './movement-events';
import { SummaryItem } from './summary-item.value-object';

interface MovementProps {
  _userId: string;
  _category: CategoryAggregate;
  _subCategoryId: string | null;
  _description: string;
  _date: Date;
  _summary: SummaryItem[];
}

interface CreateMovementProps {
  userId: string;
  category: CategoryAggregate;
  subCategoryId: string | null;
  description: string;
  date: Date;
  summary: SummaryItem[];
}

interface UpdateMovementProps {
  category?: CategoryAggregate;
  subCategoryId?: string | null;
  description?: string;
  date?: Date;
  summary?: SummaryItem[];
}

export class MovementAggregate extends AggregateRoot<MovementProps> {
  static create(create: CreateMovementProps): MovementAggregate {
    const id = uuidV4();
    const props: MovementProps = {
      _category: create.category,
      _subCategoryId: create.subCategoryId,
      _date: create.date,
      _description: create.description,
      _summary: create.summary,
      _userId: create.userId,
    };

    const movement: MovementAggregate = new MovementAggregate({ id, props });
    movement.addEvent(new events.MovementCreatedEvent({ aggregateId: id }));

    return movement;
  }

  validate(): void {
    this.props._description = this.props._description.trim().toLowerCase();
    if (this.props._description.length < 1)
      throw new Error('Description must be at least 1 character');

    if (this.props._summary.length < 1) throw new Error('No summary');

    // Validate sources and destinations
    const uniqueOrigins = new Set(this.props._summary.map(i => i.originWalletId));
    const uniqueDestinations = new Set(this.props._summary.map(i => i.destinationWalletId));
    const errors: string[] = [];

    if (
      this.props._subCategoryId !== null &&
      !this.props._category.hasSubcategory(this.props._subCategoryId)
    )
      errors.push('Invalid subcategory');

    switch (this.props._category.type) {
      case CategoryType.income:
        if (!(uniqueOrigins.has(null) && uniqueOrigins.size === 1))
          errors.push('origins can only be null');
        if (uniqueDestinations.has(null)) errors.push('null cannot be a destination');
        break;
      case CategoryType.expense:
        if (!(uniqueDestinations.has(null) && uniqueDestinations.size === 1))
          errors.push('destinations can only be null');
        if (uniqueOrigins.has(null)) errors.push('null cannot be an origin');
        break;
      case CategoryType.transfer:
        if (uniqueOrigins.has(null) || uniqueDestinations.has(null))
          errors.push('Neither origins nor destinations can be null');
        if (uniqueOrigins.size > 1 && uniqueDestinations.size > 1)
          errors.push('Cannot have multiple origins and multiple destinations at the same time');
        break;
      default:
        errors.push(`Validation for type not implemented`);
    }

    if (errors.length > 0) throw new Error(errors.join(', '));
  }

  update(update: UpdateMovementProps): void {
    if (update.date) this.props._date = update.date;
    if (update.description) this.props._description = update.description.trim().toLowerCase();
    if (update.summary) this.props._summary = update.summary;
    if (update.category) this.props._category = update.category;
    if (update.subCategoryId !== undefined) this.props._subCategoryId = update.subCategoryId;
    this._updatedAt = new Date();
    this.validate();

    this.addEvent(new events.MovementUpdatedEvent({ aggregateId: this.id }));
  }

  delete(): void {
    this.addEvent(new events.MovementDeletedEvent({ aggregateId: this.id }));
  }
}
