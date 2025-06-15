'use client';
import { ReactNode } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn-ui/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';
import { CategoryList } from '@/lib/categories/category-view/category-list';
import { useQuery } from '@tanstack/react-query';

export interface Category extends SubCategory {
  children: SubCategory[];
}

export interface SubCategory {
  id: number;
  icon: string;
  name: string;
  archived: boolean;
}

export const CategoryView = (): ReactNode => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return Categories;
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
            <CategoryList categories={query.data || []} loading={query.isLoading} />
          </TabsContent>

          {/* Expense Tab content */}
          <TabsContent value="expense">
            <CategoryList categories={query.data || []} loading={query.isLoading} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

const Categories: Category[] = [
  {
    id: 1,
    icon: 'https://avatar.iran.liara.run/public',
    name: 'Category 1',
    archived: false,
    children: [],
  },
  {
    id: 2,
    icon: 'https://avatar.iran.liara.run/public',
    name: 'Category 2',
    archived: false,
    children: [
      {
        id: 10,
        icon: 'https://avatar.iran.liara.run/public',
        name: 'Subcategory 1',
        archived: false,
      },
      {
        id: 11,
        icon: 'https://avatar.iran.liara.run/public',
        name: 'Subcategory 1',
        archived: false,
      },
      {
        id: 12,
        icon: 'https://avatar.iran.liara.run/public',
        name: 'Subcategory 1',
        archived: false,
      },
    ],
  },
  {
    id: 3,
    icon: 'https://avatar.iran.liara.run/public',
    name: 'Category 3',
    archived: false,
    children: [
      {
        id: 30,
        icon: 'https://avatar.iran.liara.run/public',
        name: 'Subcategory 21',
        archived: true,
      },
    ],
  },
  {
    id: 4,
    icon: 'https://avatar.iran.liara.run/public',
    name: 'Category 4',
    children: [],
    archived: true,
  },
  {
    id: 5,
    icon: 'https://avatar.iran.liara.run/public',
    name: 'Category 5',
    children: [],
    archived: true,
  },
  {
    id: 6,
    icon: 'https://avatar.iran.liara.run/public',
    name: 'Category 6',
    archived: false,
    children: [
      {
        id: 40,
        icon: 'https://avatar.iran.liara.run/public',
        name: 'Subcategory 210',
        archived: false,
      },
    ],
  },
];
