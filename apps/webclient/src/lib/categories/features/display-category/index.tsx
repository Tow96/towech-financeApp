'use client';
import { CategoryType, useCategories } from '@/lib/categories/data-store';
import { ReactNode } from 'react';

import { AppIcon } from '@/lib/icons';
import { capitalizeFirst } from '@/lib/utils';

interface CategoryIconProps {
  className?: string;
  type: CategoryType;
  id: string | null;
  subId: string | null;
}

export const CategoryIcon = (props: CategoryIconProps): ReactNode => {
  const categories = useCategories();
  const category = categories.data?.find(c => c.id === props.id);

  return (
    <AppIcon
      className={props.className}
      name={
        props.subId === null
          ? category?.name || 'N/A'
          : category?.subCategories.find(s => s.id === props.subId)?.name || 'N/A'
      }
      id={
        props.subId === null
          ? category?.iconId || 0
          : category?.subCategories.find(s => s.id === props.subId)?.iconId || 0
      }
    />
  );
};

interface CategoryNameProps {
  className?: string;
  type: CategoryType;
  id: string | null;
  subId: string | null;
}

export const CategoryName = (props: CategoryNameProps): ReactNode => {
  const categories = useCategories();
  const category = categories.data?.find(c => c.id === props.id);

  return props.subId === null
    ? category?.name || capitalizeFirst(props.type)
    : category?.subCategories.find(s => s.id === props.subId)?.name || capitalizeFirst(props.type);
};
