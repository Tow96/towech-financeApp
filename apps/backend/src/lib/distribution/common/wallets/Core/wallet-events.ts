// App packages
import { DomainEvent, DomainEventProps } from '../../../../_common/primitives/domain-event.base';

export class WalletCreatedEvent extends DomainEvent {
  constructor(props: DomainEventProps<WalletCreatedEvent>) {
    super(props);
  }
}

export class WalletUpdatedEvent extends DomainEvent {
  constructor(props: DomainEventProps<WalletUpdatedEvent>) {
    super(props);
  }
}

export class WalletArchivedEvent extends DomainEvent {
  constructor(props: DomainEventProps<WalletArchivedEvent>) {
    super(props);
  }
}

export class WalletRestoredEvent extends DomainEvent {
  constructor(props: DomainEventProps<WalletRestoredEvent>) {
    super(props);
  }
}

export class WalletDeletedEvent extends DomainEvent {
  constructor(props: DomainEventProps<WalletDeletedEvent>) {
    super(props);
  }
}
