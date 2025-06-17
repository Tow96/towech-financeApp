'use client';
// External packages
import { ReactNode } from 'react';

// App packages
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn-ui/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';

// Data store
import { useCategories } from '../../../data-store';

// Internal references
import { CategoryList } from './category-list';
import { AddCategoryButton } from '../add-category';

export const CategoriesView = (): ReactNode => {
  const categories = useCategories();

  return (
    <Card className="m-4">
      <Tabs defaultValue="expense">
        <CardHeader className="flex">
          <TabsList>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>

          {/* Spacer */}
          <div className="flex-1" />
          <AddCategoryButton />
        </CardHeader>

        <CardContent>
          {/* Income Tab content */}
          <TabsContent value="income">
            <CategoryList
              categories={categories.data?.Income || []}
              loading={categories.isLoading}
            />
          </TabsContent>

          {/* Expense Tab content */}
          <TabsContent value="expense">
            <CategoryList
              categories={categories.data?.Expense || []}
              loading={categories.isLoading}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
