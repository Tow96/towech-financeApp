// External packages
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { EventEmitter2 } from '@nestjs/event-emitter';

// App packages
import { ICategoryRepository } from '../../../../_common/categories';

// Slice packages
import { DISTRIBUTION_SCHEMA_CONNECTION } from '../../distribution.provider';
import { DistributionSchema } from '../../distribution.schemta';
import { IMovementRepository, MovementAggregate, events } from '../core';

// Internal references
import { MovementMapper } from './movement.model';

@Injectable()
export class PostgresMovementRepository implements IMovementRepository {
  private readonly _logger = new Logger(`Distribution.${PostgresMovementRepository.name}`);
  private readonly _mapper = new MovementMapper();

  constructor(
    @Inject(DISTRIBUTION_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof DistributionSchema>,
    private readonly _categoryRepo: ICategoryRepository,
    private readonly _eventEmitter: EventEmitter2
  ) {}

  async getMovementOwner(id: string): Promise<string | null> {
    this._logger.debug(`Fetching owner of movement: ${id}`);

    const result = await this._db
      .select({ owner: DistributionSchema.movements.userId })
      .from(DistributionSchema.movements)
      .where(eq(DistributionSchema.movements.id, id));

    if (result.length === 0) return null;
    return result[0].owner;
  }

  async getById(id: string): Promise<MovementAggregate | null> {
    this._logger.debug(`Fetching movement with id: ${id}`);

    const resultMovement = await this._db.query.movements.findMany({
      with: { summary: true },
      where: eq(DistributionSchema.movements.id, id),
    });

    if (resultMovement.length === 0) return null;

    // TODO: Add foreign key?
    const resultCategory = await this._categoryRepo.getById(resultMovement[0].id);
    return this._mapper.toDomain(resultMovement[0], resultCategory!);
  }

  async saveChanges(aggregate: MovementAggregate): Promise<void> {
    await this._db.transaction(async tx => {
      const model = this._mapper.toPersistence(aggregate);

      for (let i = 0; i < aggregate.domainEvents.length; i++) {
        const event = aggregate.domainEvents[i];

        switch (event.constructor) {
          case events.MovementCreatedEvent:
            await tx.insert(DistributionSchema.movements).values(model);
            await tx.insert(DistributionSchema.summary).values(model.summary);
            break;
          case events.MovementUpdatedEvent:
            await tx
              .update(DistributionSchema.movements)
              .set(model)
              .where(eq(DistributionSchema.movements.id, model.id));
            await tx
              .delete(DistributionSchema.summary)
              .where(eq(DistributionSchema.summary.movementId, model.id));
            await tx.insert(DistributionSchema.summary).values(model.summary);
            break;
          case events.MovementDeletedEvent:
            await tx
              .delete(DistributionSchema.summary)
              .where(eq(DistributionSchema.summary.movementId, model.id));
            await tx
              .delete(DistributionSchema.movements)
              .where(eq(DistributionSchema.movements.id, model.id));
            break;
        }
      }
    });

    await aggregate.publishEvents(this._logger, this._eventEmitter);
  }
}
