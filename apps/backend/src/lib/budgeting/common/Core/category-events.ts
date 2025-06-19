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
