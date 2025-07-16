import { ReactNode } from 'react';

import { SubCategoryDto } from '@/lib/categories/data-store';
import { AppIcon } from '@/lib/icons';
import { SubCategoryItemMenu } from '@/lib/categories/features/manage-categories/category-item/subcategory-item/menu';

interface SubCategoryItemProps {
  subCategory: SubCategoryDto;
  parentId: string;
}

export const SubCategoryItem = (props: SubCategoryItemProps): ReactNode => {
  const disabledClasses = 'pointer-events-none opacity-50';

  return (
    <div className="flex items-center pl-10 gap-2 py-3">
      <div
        className={`flex flex-1 gap-2 items-center ${props.subCategory.archived ? disabledClasses : ''}`}>
        <AppIcon
          className="rounded-full w-10 h-10"
          id={props.subCategory.iconId}
          name={props.subCategory.name}
        />

        {/*  Name */}
        <span className="flex-1 text-lg">{props.subCategory.name}</span>
      </div>

      <SubCategoryItemMenu subCategory={props.subCategory} parentId={props.parentId} />
    </div>
  );
};
