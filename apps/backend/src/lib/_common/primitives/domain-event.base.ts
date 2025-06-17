import { Guard } from './guard';
import { v4 as uuidV4 } from 'uuid';

type DomainEventMetadata = {
  readonly timestamp: number;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: string;
  metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
  public readonly id: string;

  public readonly aggregateId: string;
  public readonly metadata: DomainEventMetadata;

  constructor(props: DomainEventProps<unknown>) {
    if (Guard.isEmpty(props)) throw new Error('DomainEvent props should not be empty');
    this.id = uuidV4();
    this.aggregateId = props.aggregateId;
    this.metadata = {
      timestamp: props.metadata?.timestamp || Date.now(),
    };
  }
}
