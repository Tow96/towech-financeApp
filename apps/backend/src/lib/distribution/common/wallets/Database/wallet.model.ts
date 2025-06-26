// App packages
import { InferResultType } from '../../../../_common/primitives/infer-result-type';

// Slice packages
import { DistributionSchema } from '../../distribution.schema';
import { WalletAggregate } from '../Core/wallet.aggregate';

type Schema = typeof DistributionSchema;
export type WalletModel = InferResultType<Schema, 'wallets'>;

export class WalletMapper {
  toPersistence(entity: WalletAggregate): WalletModel {
    const copy = entity.getProps();
    return { ...copy };
  }

  toDomain(model: WalletModel): WalletAggregate {
    return new WalletAggregate({
      id: model.id,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      props: {
        deletedAt: model.deletedAt === null ? null : new Date(model.deletedAt),
        userId: model.userId,
        iconId: model.iconId,
        name: model.name,
      },
    });
  }
}
