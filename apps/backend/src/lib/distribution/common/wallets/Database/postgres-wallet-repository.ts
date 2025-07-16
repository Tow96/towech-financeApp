// External packages
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import { EventEmitter2 } from '@nestjs/event-emitter';

// App packages
import { DISTRIBUTION_SCHEMA_CONNECTION } from '../../distribution.provider';
import { DistributionSchema } from '../../distribution.schemta';
import * as events from '../Core/wallet-events';
import { IWalletRepository } from '../Core/i-wallet-repository';
import { WalletMapper } from './wallet.model';
import { WalletAggregate } from '../Core/wallet.aggregate';

@Injectable()
export class PostgresWalletRepository implements IWalletRepository {
  private readonly _logger = new Logger(`Distribution.${PostgresWalletRepository.name}`);
  private readonly _mapper = new WalletMapper();

  constructor(
    @Inject(DISTRIBUTION_SCHEMA_CONNECTION)
    private readonly _db: NodePgDatabase<typeof DistributionSchema>,
    private readonly _eventEmitter: EventEmitter2
  ) {}

  async walletExists(userId: string, name: string): Promise<string | null> {
    this._logger.debug(`Fetching existence of wallet owned by: ${userId} with name: ${name}`);

    const result = await this._db
      .select({ id: DistributionSchema.wallets.id })
      .from(DistributionSchema.wallets)
      .where(
        and(
          eq(DistributionSchema.wallets.userId, userId),
          eq(DistributionSchema.wallets.name, name.trim().toLowerCase())
        )
      );

    if (result.length === 0) return null;
    return result[0].id;
  }

  async getWalletOwner(id: string): Promise<string | null> {
    this._logger.debug(`Fetching owner of wallet: ${id}`);

    const result = await this._db
      .select({ id: DistributionSchema.wallets.userId })
      .from(DistributionSchema.wallets)
      .where(eq(DistributionSchema.wallets.id, id));

    if (result.length === 0) return null;
    return result[0].id;
  }

  async getById(id: string): Promise<WalletAggregate | null> {
    this._logger.debug(`Fetching wallet with id: ${id}`);

    const result = await this._db
      .select()
      .from(DistributionSchema.wallets)
      .where(eq(DistributionSchema.wallets.id, id));

    if (result.length === 0) return null;
    return this._mapper.toDomain(result[0]);
  }

  async saveChanges(aggregate: WalletAggregate): Promise<void> {
    await this._db.transaction(async tx => {
      const model = this._mapper.toPersistence(aggregate);

      for (let i = 0; i < aggregate.domainEvents.length; i++) {
        const event = aggregate.domainEvents[i];

        switch (event.constructor) {
          case events.WalletCreatedEvent:
            await tx.insert(DistributionSchema.wallets).values(model);
            break;
          case events.WalletUpdatedEvent:
          case events.WalletArchivedEvent:
          case events.WalletRestoredEvent:
            await tx
              .update(DistributionSchema.wallets)
              .set(model)
              .where(eq(DistributionSchema.wallets.id, model.id));
            break;
          case events.WalletDeletedEvent:
            await tx
              .delete(DistributionSchema.wallets)
              .where(eq(DistributionSchema.wallets.id, model.id));
            break;
        }
      }
    });
    await aggregate.publishEvents(this._logger, this._eventEmitter);
  }
}
