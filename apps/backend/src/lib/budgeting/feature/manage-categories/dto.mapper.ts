import { CategoryAggregate } from '../../common/Core/category-aggregate';

export class DtoMapper {
  categoryToDto(entity: CategoryAggregate): CategoryDto {
    const copy = entity.getProps();

    return {
      id: copy.id,
      archived: copy.deletedAt !== null,
      iconId: copy.iconId,
      type: copy.type,
      userId: copy.userId,
      name: copy.name,
    };
  }
}

export interface CategoryDto {
  id: string;
  userId: string;
  iconId: number;
  type: string;
  archived: boolean;
  name: string;
}
