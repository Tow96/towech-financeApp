// External packages
import { v4 as uuidV4 } from 'uuid';

// App packages
import { AggregateRoot } from '../../../../_common/primitives/aggregate-root.base';

// Slice packages
import * as events from './movement-events';
import { SummaryItem } from './summary-item.value-object';

interface MovementProps {
  userId: string;
  categoryId: string;
  description: string;
  date: Date;
  summary: SummaryItem[];
}

interface CreateMovementProps {
  userId: string;
  categoryId: string;
  description: string;
  date: Date;
  summary: SummaryItem[];
}

interface UpdateMovementProps {
  categoryId?: string;
  description?: string;
  date?: Date;
  summary?: SummaryItem[];
}

export class MovementAggregate extends AggregateRoot<MovementProps> {
  static create(create: CreateMovementProps): MovementAggregate {
    const id = uuidV4();
    const props: MovementProps = { ...create };

    const movement: MovementAggregate = new MovementAggregate({ id, props });
    movement.addEvent(new events.MovementCreatedEvent({ aggregateId: id }));

    return movement;
  }

  validate(): void {
    this.props.description = this.props.description.trim().toLowerCase();
    if (this.props.description.length < 1)
      throw new Error('Description must be at least 1 character');

    if (this.props.summary.length < 1) throw new Error('No summary');
    // Either all origins or all destinations must be the same
    
  }

  update(update: UpdateMovementProps): void {
    if (update.date) this.props.date = update.date;
    if (update.description) this.props.description = update.description.trim().toLowerCase();
    if (update.summary) this.props.summary = update.summary;
    if (update.categoryId) this.props.categoryId = update.categoryId;
    this._updatedAt = new Date();
    this.validate();

    this.addEvent(new events.MovementCreatedEvent({ aggregateId: this.id }));
  }
}
