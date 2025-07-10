// App packages
import { DomainEvent, DomainEventProps } from '../../../../_common/primitives';

export class MovementCreatedEvent extends DomainEvent {
  constructor(props: DomainEventProps<MovementCreatedEvent>) {
    super(props);
  }
}

export class MovementUpdatedEvent extends DomainEvent {
  constructor(props: DomainEventProps<MovementUpdatedEvent>) {
    super(props);
  }
}

export class MovementDeletedEvent extends DomainEvent {
  constructor(props: DomainEventProps<MovementDeletedEvent>) {
    super(props);
  }
}
