import { ReactNode } from 'react';

import { SubCategoryDto } from '@/lib/categories/data-store';
import { AppIcon } from '@/lib/icons';
import { SubCategoryItemMenu } from '@/lib/categories/features/manage-categories/category-item/subcategory-item/menu';

interface SubCategoryItemProps {
  subCategory: SubCategoryDto;
  parentId: string;
}

export const SubCategoryItem = (props: SubCategoryItemProps): ReactNode => {
  return (
    <div className="flex items-center pl-10 gap-2 py-3">
      <AppIcon
        className="rounded-full w-10 h-10"
        id={props.subCategory.iconId}
        name={props.subCategory.name}
      />

      {/*  Name */}
      <span className="flex-1 text-lg">{props.subCategory.name}</span>

      <SubCategoryItemMenu subCategory={props.subCategory} parentId={props.parentId} />
    </div>
  );
};
