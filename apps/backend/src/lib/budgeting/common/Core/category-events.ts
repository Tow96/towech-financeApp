import { DomainEvent, DomainEventProps } from '../../../_common/primitives/domain-event.base';
import { CategoryType } from './category-aggregate';

export class CategoryCreatedEvent extends DomainEvent {
  readonly userId: string;
  readonly type: CategoryType;
  readonly name: string;

  constructor(props: DomainEventProps<CategoryCreatedEvent>) {
    super(props);
    this.type = props.type;
    this.name = props.name;
    this.userId = props.userId;
  }
}

export class CategoryUpdatedEvent extends DomainEvent {
  readonly type: CategoryType;
  readonly name: string;

  constructor(props: DomainEventProps<CategoryUpdatedEvent>) {
    super(props);
    this.type = props.type;
    this.name = props.name;
  }
}

export class CategoryArchivedEvent extends DomainEvent {
  constructor(props: DomainEventProps<CategoryArchivedEvent>) {
    super(props);
  }
}

export class CategoryRestoredEvent extends DomainEvent {
  constructor(props: DomainEventProps<CategoryArchivedEvent>) {
    super(props);
  }
}
