import { ReactNode } from 'react';

import { CategoryDto } from '@/lib/categories/data-store';
import { Accordion } from '@/lib/shadcn-ui/components/ui/accordion';

import { CategoryItemSkeleton, CategoryItem } from './category-item';

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
