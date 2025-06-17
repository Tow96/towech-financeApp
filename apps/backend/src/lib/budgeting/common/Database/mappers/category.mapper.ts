import { CategoryEntity, CategoryType } from '../../Core/Category.entity';
import { CategoryModel } from '../models';

export class CategoryMapper {
  toPersistence(entity: CategoryEntity): CategoryModel {
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
      parentId: copy.parentId,
    };
  }

  toEntity(model: CategoryModel): CategoryEntity {
    return new CategoryEntity({
      id: model.id,
      createdAt: new Date(model.createdAt),
      updatedAt: new Date(model.updatedAt),
      props: {
        parentId: model.parentId,
        deletedAt: model.deletedAt === null ? null : new Date(model.deletedAt),
        userId: model.userId,
        type: model.userId as CategoryType,
        name: model.name,
        iconId: model.iconId,
      },
    });
  }
}
