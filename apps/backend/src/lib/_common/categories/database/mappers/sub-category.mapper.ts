// Slice packages
import { SubCategoryEntity } from '../../core';

// Internal references
import { SubCategoryModel } from '../models';

// ----------------------------------------------
export class SubCategoryMapper {
  toPersistence(parentId: string, entity: SubCategoryEntity): SubCategoryModel {
    const copy = entity.getProps();

    return {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      iconId: copy.iconId,
      name: copy.name,
      parentId: parentId,
    };
  }

  toDomain(model: SubCategoryModel): SubCategoryEntity {
    return new SubCategoryEntity({
      id: model.id,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      props: {
        name: model.name,
        iconId: model.iconId,
      },
    });
  }
}
