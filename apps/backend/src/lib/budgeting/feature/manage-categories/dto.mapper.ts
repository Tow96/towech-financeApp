import { CategoryAggregate, SubCategoryEntity } from '../../../_common/categories';

export class DtoMapper {
  categoryToDto(entity: CategoryAggregate): CategoryDto {
    const copy = entity.getProps();
    const subCategories = copy.subCategories.map(s => this.subCategoryToDto(s));

    return {
      id: copy.id,
      archived: copy.deletedAt !== null,
      iconId: copy.iconId,
      type: copy.type,
      userId: copy.userId,
      name: copy.name,
      subCategories: subCategories,
    };
  }

  subCategoryToDto(entity: SubCategoryEntity): SubCategoryDto {
    const copy = entity.getProps();

    return {
      id: copy.id,
      iconId: copy.iconId,
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
  subCategories: SubCategoryDto[];
}

export interface SubCategoryDto {
  id: string;
  name: string;
  iconId: number;
}
