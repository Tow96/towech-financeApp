import { Entity } from './entity.base';
import { DomainEvent } from './domain-event.base';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents() {
    return this._domainEvents;
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public async publishEvents(logger: Logger, eventEmitter: EventEmitter2): Promise<void> {
    await Promise.all(
      this.domainEvents.map(event => {
        logger.debug(`"${event.constructor.name}" event published for aggregate: ${this.id}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        return eventEmitter.emitAsync(event.constructor.name, event);
      })
    );
    this.clearEvents();
  }
}
