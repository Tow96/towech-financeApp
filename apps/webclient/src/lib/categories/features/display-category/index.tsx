'use client';
import { useCategories } from '@/lib/categories/data-store';
import { ReactNode } from 'react';

import { AppIcon } from '@/lib/icons';

interface CategoryIconProps {
  className?: string;
  id: string;
}

export const CategoryIcon = (props: CategoryIconProps): ReactNode => {
  const categories = useCategories();
  const category = categories.data?.find(c => c.id === props.id);

  return (
    <AppIcon
      className={props.className}
      name={category?.name || 'N/A'}
      id={category?.iconId || 0}
    />
  );
};

interface CategoryNameProps {
  className?: string;
  id: string;
}
export const CategoryName = (props: CategoryNameProps): ReactNode => {
  const categories = useCategories();
  const category = categories.data?.find(c => c.id === props.id);

  return category?.name || 'N/A';
};
