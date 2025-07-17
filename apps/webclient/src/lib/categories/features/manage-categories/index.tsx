'use client';
import { ReactNode } from 'react';

// App packages
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn-ui/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';

import { CategoryDto, CategoryType, useCategories } from '@/lib/categories/data-store';

// Internal
import { CategoryList } from './category-list';
import { AddCategoryButton } from './add-category';

export const ManageCategoriesView = (): ReactNode => {
  const categories = useCategories();

  return (
    <Card className="m-4">
      <Tabs defaultValue="expense">
        {/* Header */}
        <CardHeader className="flex">
          <TabsList>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>

          {/* Spacer */}
          <div className="flex-1" />
          <AddCategoryButton />
        </CardHeader>

        {/* Content */}
        <CardContent>
          {/* Income tab */}
          <TabsContent value="income">
            <CategoryList
              categories={(categories.data || []).filter(
                (c: CategoryDto) => c.type === CategoryType.income
              )}
              loading={categories.isLoading}
            />
          </TabsContent>

          {/* Expense tab */}
          <TabsContent value="expense">
            <CategoryList
              categories={(categories.data || []).filter(
                (c: CategoryDto) => c.type === CategoryType.expense
              )}
              loading={categories.isLoading}
            />
          </TabsContent>

          {/*  Transfer tab */}
          <TabsContent value="transfer">
            <CategoryList
              categories={(categories.data || []).filter(
                (c: CategoryDto) => c.type === CategoryType.transfer
              )}
              loading={categories.isLoading}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
