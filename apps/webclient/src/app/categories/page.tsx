import { ReactNode } from 'react';
import { CategoriesView } from '@/lib/budgeting';
import { Features } from '@/lib/categories'

const CategoriesPage = (): ReactNode => {
  return <Features.ManageCategoriesView />;
};

export default CategoriesPage;
