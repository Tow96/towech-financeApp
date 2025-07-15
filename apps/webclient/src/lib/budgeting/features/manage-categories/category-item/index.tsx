// External packages
import { ReactNode } from 'react';

// App packages
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/lib/shadcn-ui/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/shadcn-ui/components/ui/avatar';
import { Skeleton } from '@/lib/shadcn-ui/components/ui/skeleton';

// Data Access
import { CategoryDtoLegacy } from '../../../data-store';

// Internal References
import { CategoryItemMenu } from './menu';

export const CategoryItem = ({ category }: { category: CategoryDtoLegacy }): ReactNode => {
  return (
    <AccordionItem value={category.id.toString()}>
      {/* Header */}
      <div className="flex items-center">
        <AccordionTrigger
          className="flex items-center"
          empty={category.subcategories.length === 0}
          disabled={category.archived}>
          {/* Icon */}
          <div>
            <Avatar className="rounded-full w-12 h-12">
              <AvatarImage src={category.iconUrl} alt={category.name} />
              <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          {/* Name */}
          <span className="flex-1 text-xl">{category.name}</span>
        </AccordionTrigger>
        <CategoryItemMenu archived={category.archived} />
      </div>

      {/* Subcategories */}
      {category.subcategories.length > 0 && (
        <AccordionContent>
          {category.subcategories.map(subcategory => (
            <div key={subcategory.id} className="flex items-center pl-10 gap-2 py-3">
              {/* Icon */}
              <div>
                <Avatar className="rounded-full w-10 h-10">
                  <AvatarImage src={subcategory.iconUrl} alt={subcategory.name} />
                  <AvatarFallback>{subcategory.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              {/* Name */}
              <span className="flex-1 text-lg">{subcategory.name}</span>
              <CategoryItemMenu isChild={true} archived={subcategory.archived} />
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
