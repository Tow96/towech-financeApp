'use client';
import { ReactNode } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn-ui/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';
import { CategoryList } from '@/lib/budgeting/category-view/category-list';
import { useQuery } from '@tanstack/react-query';
import { GetAllCategories } from '@/lib/budgeting/category-view/getAllCategories';
import { GetAllCategoriesDto } from './get-all-categories.dto';
import { useAuth } from '@clerk/clerk-react';

export const CategoryView = (): ReactNode => {
  const auth = useAuth();

  const query = useQuery<GetAllCategoriesDto>({
    queryKey: ['categories'],
    queryFn: async () => {
      const token = (await auth.getToken()) || '';
      return GetAllCategories(token);
    },
  });

  return (
    <Card className="m-4">
      <Tabs defaultValue="expense">
        <CardHeader>
          <TabsList>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent>
          {/* Income Tab content */}
          <TabsContent value="income">
            <CategoryList categories={query.data?.Income || []} loading={query.isLoading} />
          </TabsContent>

          {/* Expense Tab content */}
          <TabsContent value="expense">
            <CategoryList categories={query.data?.Expense || []} loading={query.isLoading} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
