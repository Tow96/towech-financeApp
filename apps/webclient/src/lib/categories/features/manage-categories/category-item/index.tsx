import { CategoryDto } from '@/lib/categories/data-store';
import { ReactNode } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/lib/shadcn-ui/components/ui/accordion';
import { Skeleton } from '@/lib/shadcn-ui/components/ui/skeleton';
import { AppIcon } from '@/lib/icons';
import { CategoryItemMenu } from './menu';

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
          <span className="flex-1 text-xl">{category.name}</span>
        </AccordionTrigger>
        <CategoryItemMenu category={category} />
      </div>

      {/* Subcategories */}
      {category.subCategories.length > 0 && (
        <AccordionContent>
          {category.subCategories.map(subCat => (
            <div key={subCat.id} className="flex items-center pl-10 gap-2 py-3">
              {/* Icon */}
              <AppIcon
                className="rounded-full w-10 h-10"
                id={category.iconId}
                name={category.name}
              />

              {/* Name */}
              <span className="flex-1 text-lg">{subCat.name}</span>
            </div>
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
