// Internal references
import { CategoryAggregate, CategoryType } from '../../core';
import { CategoryModel } from '../models';
import { SubCategoryMapper } from './sub-category.mapper';

// ----------------------------------------------
export class CategoryMapper {
  private readonly subMapper = new SubCategoryMapper();

  toPersistence(entity: CategoryAggregate): CategoryModel {
    const copy = entity.getProps();

    return {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      iconId: copy.iconId,
      name: copy.name,
      type: copy.type,
      userId: copy.userId,
      deletedAt: copy.deletedAt,
      subCategories: copy.subCategories.map(s => this.subMapper.toPersistence(copy.id, s)),
    };
  }

  toDomain(model: CategoryModel): CategoryAggregate {
    return new CategoryAggregate({
      id: model.id,
      createdAt: new Date(model.createdAt),
      updatedAt: new Date(model.updatedAt),
      props: {
        deletedAt: model.deletedAt === null ? null : new Date(model.deletedAt),
        userId: model.userId,
        type: model.type as CategoryType,
        name: model.name,
        iconId: model.iconId,
        subCategories: model.subCategories.map(s => this.subMapper.toDomain(s)),
      },
    });
  }
}
