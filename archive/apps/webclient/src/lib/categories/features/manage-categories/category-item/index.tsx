import { ReactNode } from 'react';
import { CategoryDto } from '@/lib/categories/data-store';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/lib/shadcn-ui/components/ui/accordion';
import { Skeleton } from '@/lib/shadcn-ui/components/ui/skeleton';
import { AppIcon } from '@/lib/icons';
import { CategoryItemMenu } from './menu';
import { SubCategoryItem } from './subcategory-item';
import { capitalizeFirst } from '@/lib/utils';

interface CategoryItemProps {
  category: CategoryDto;
}

export const CategoryItem = ({ category }: CategoryItemProps): ReactNode => {
  return (
    <AccordionItem value={category.id}>
      {/* Main body */}
      <div className="flex items-center">
        <AccordionTrigger
          className="flex items-center"
          empty={category.subCategories.length === 0 || category.archived}
          disabled={category.archived}>
          {/* Icon */}
          <AppIcon className="rounded-full w-12 h-12" id={category.iconId} name={category.name} />

          {/* Name */}
          <span className="flex-1 text-xl">{capitalizeFirst(category.name)}</span>
        </AccordionTrigger>
        <CategoryItemMenu category={category} />
      </div>

      {/* Subcategories */}
      {category.subCategories.length > 0 && (
        <AccordionContent>
          {category.subCategories.map(subCat => (
            <SubCategoryItem key={subCat.id} subCategory={subCat} parentId={category.id} />
          ))}
        </AccordionContent>
      )}
    </AccordionItem>
  );
};

export const CategoryItemSkeleton = (): ReactNode => (
  <div className="flex items-center gap-4 py-4 border-b-1 last:border-b-0">
    <Skeleton className="rounded-full w-12 h-12" />
    <Skeleton className="w-2/3 h-3" />
  </div>
);
