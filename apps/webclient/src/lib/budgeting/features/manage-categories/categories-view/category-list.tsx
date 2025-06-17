// External packages
import { ReactNode } from 'react';

// App packages
import { Accordion } from '@/lib/shadcn-ui/components/ui/accordion';

// Data Store
import { CategoryDto } from '../../../data-store';

// Internal references
import { CategoryItem, CategoryItemSkeleton } from '../category-item';

interface CategoryListProps {
  categories: CategoryDto[];
  loading: boolean;
}

export const CategoryList = (props: CategoryListProps): ReactNode => {
  return (
    <Accordion type="multiple">
      {props.loading ? (
        <ListSkeleton />
      ) : (
        props.categories.map(category => <CategoryItem key={category.id} category={category} />)
      )}
    </Accordion>
  );
};

const ListSkeleton = (): ReactNode => {
  return (
    <>
      <CategoryItemSkeleton />
      <CategoryItemSkeleton />
      <CategoryItemSkeleton />
      <CategoryItemSkeleton />
      <CategoryItemSkeleton />
      <CategoryItemSkeleton />
      <CategoryItemSkeleton />
    </>
  );
};
