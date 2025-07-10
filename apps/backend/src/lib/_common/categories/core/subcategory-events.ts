// Slice packages
import { CategoryType } from './category-aggregate';

// Internal references
import { DomainEvent, DomainEventProps } from '../../primitives';

// ----------------------------------------------
export class SubCategoryCreatedEvent extends DomainEvent {
  readonly userId: string;
  readonly categoryId: string;
  readonly name: string;
  readonly type: CategoryType;

  constructor(props: DomainEventProps<SubCategoryCreatedEvent>) {
    super(props);
    this.userId = props.userId;
    this.categoryId = props.categoryId;
    this.name = props.name;
    this.type = props.type;
  }
}

export class SubCategoryUpdatedEvent extends DomainEvent {
  readonly categoryId: string;
  readonly type: CategoryType;
  readonly name: string;

  constructor(props: DomainEventProps<SubCategoryUpdatedEvent>) {
    super(props);
    this.categoryId = props.categoryId;
    this.type = props.type;
    this.name = props.name;
  }
}

export class SubCategoryRemovedEvent extends DomainEvent {
  readonly categoryId: string;

  constructor(props: DomainEventProps<SubCategoryRemovedEvent>) {
    super(props);
    this.categoryId = props.categoryId;
  }
}
