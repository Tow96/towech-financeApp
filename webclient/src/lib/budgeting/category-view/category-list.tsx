import { ReactNode } from 'react';
import { Accordion } from '@/lib/shadcn-ui/components/ui/accordion';
import { CategoryItem, CategoryItemSkeleton } from '@/lib/budgeting/category-view/category-item';
import { CategoryDto } from './get-all-categories.dto';

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
