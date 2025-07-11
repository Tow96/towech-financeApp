// App packages
import { InferResultType } from '../../../../_common/primitives';

// Slice Packages
import { DistributionSchema } from '../../distribution.schema';
import { MovementAggregate, SummaryItem } from '../core';
import { CategoryAggregate } from '../../../../_common/categories';

type Schema = typeof DistributionSchema;
export type MovementModel = InferResultType<Schema, 'movements', { summary: true }>;
type SummaryModel = InferResultType<Schema, 'summary'>;

export class MovementMapper {
  private readonly summaryMapper = new SummaryMapper();

  toPersistence(entity: MovementAggregate): MovementModel {
    const copy = entity.getProps();

    return {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      userId: copy._userId,
      date: copy._date,
      categoryId: copy._category.id,
      subCategoryId: copy._subCategoryId,
      description: copy._description,
      summary: copy._summary.map(s => this.summaryMapper.toPersistence(copy.id, s)),
    };
  }

  // TODO: Improve this mapping to not require a direct category
  toDomain(model: MovementModel, category: CategoryAggregate): MovementAggregate {
    if (model.categoryId !== category.id)
      throw new Error('Invalid MovementAggregate mapping, category id must match');

    return new MovementAggregate({
      id: model.id,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      props: {
        _description: model.description,
        _date: model.date,
        _userId: model.userId,
        _category: category,
        _subCategoryId: model.subCategoryId,
        _summary: model.summary.map(s => this.summaryMapper.toDomain(s)),
      },
    });
  }
}

class SummaryMapper {
  toPersistence(movementId: string, valueObject: SummaryItem): SummaryModel {
    const copy = valueObject.unpack();

    return { ...copy, movementId };
  }

  toDomain(model: SummaryModel): SummaryItem {
    return new SummaryItem({ ...model });
  }
}
