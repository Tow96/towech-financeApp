import { ReactNode } from 'react';
import { Accordion } from '@/lib/shadcn-ui/components/ui/accordion';
import { Category } from '@/lib/categories/category-view/index';
import { CategoryItem, CategoryItemSkeleton } from '@/lib/categories/category-view/category-item';

interface CategoryListProps {
  categories: Category[];
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
