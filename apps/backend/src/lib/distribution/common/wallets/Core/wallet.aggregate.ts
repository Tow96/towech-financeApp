// External packages
import { v4 as uuidV4 } from 'uuid';

// App packages
import { AggregateRoot } from '../../../../_common/primitives/aggregate-root.base';

// Slice packages
import * as events from './wallet-events';

interface WalletProps {
  userId: string;
  iconId: number;
  name: string;
  deletedAt: Date | null;
}

interface CreateWalletProps {
  userId: string;
  iconId: number;
  name: string;
}

interface UpdateWalletProps {
  iconId?: number;
  name?: string;
}

export class WalletAggregate extends AggregateRoot<WalletProps> {
  static create(create: CreateWalletProps): WalletAggregate {
    const id = uuidV4();
    const props: WalletProps = { ...create, deletedAt: null };

    const wallet: WalletAggregate = new WalletAggregate({ id, props });
    wallet.addEvent(new events.WalletCreatedEvent({ aggregateId: id }));

    return wallet;
  }

  validate(): void {
    this.props.name = this.props.name.trim().toLowerCase();
    if (this.props.name.length < 2) throw new Error('name must be at least 2 characters long');
    if (this.props.name.length > 50) throw new Error('name cannot be longer than 50 characters');
  }

  get userId() {
    return this.props.userId;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  update(update: UpdateWalletProps): void {
    if (update.iconId) this.props.iconId = update.iconId;
    if (update.name) this.props.name = update.name;
    this._updatedAt = new Date();
    this.validate();

    this.addEvent(new events.WalletUpdatedEvent({ aggregateId: this._id }));
  }

  archive(): void {
    if (this.props.deletedAt !== null) return;

    this.props.deletedAt = new Date();
    this.addEvent(new events.WalletArchivedEvent({ aggregateId: this._id }));
  }

  restore(): void {
    if (this.props.deletedAt === null) return;

    this.props.deletedAt = null;
    this.addEvent(new events.WalletRestoredEvent({ aggregateId: this._id }));
  }
}
