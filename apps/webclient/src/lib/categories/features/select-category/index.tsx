'use client';
import { ReactNode } from 'react';

import { CategoryDto, CategoryType, useCategories } from '@/lib/categories/data-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/shadcn-ui/components/ui/select';
import { AppIcon } from '@/lib/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn-ui/components/ui/tabs';

interface CategorySelectorProps {
  className?: string;
}

export const CategorySelector = (props: CategorySelectorProps): ReactNode => {
  const categories = useCategories();

  return (
    <Select>
      <SelectTrigger className="w-full !h-12">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <Tabs defaultValue="expense">
          {/* Header */}
          <TabsList>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>

          <CategorySelectionTab
            value="income"
            categories={(categories.data || []).filter(
              (c: CategoryDto) => c.type === CategoryType.income
            )}
          />
          <CategorySelectionTab
            value="expense"
            categories={(categories.data || []).filter(
              (c: CategoryDto) => c.type === CategoryType.expense
            )}
          />
          <CategorySelectionTab
            value="transfer"
            categories={(categories.data || []).filter(
              (c: CategoryDto) => c.type === CategoryType.transfer
            )}
          />
        </Tabs>
      </SelectContent>
    </Select>
  );
};

interface CategorySelectionTab {
  value: string;
  categories: CategoryDto[];
}

const CategorySelectionTab = (props: CategorySelectionTab): ReactNode => (
  <TabsContent value={props.value}>
    {props.categories.map(cat => (
      <div key={cat.id} className="border-b-1 last:border-b-0">
        <SelectCategoryItem className="py-2" value={cat.id} name={cat.name} iconId={cat.iconId} />

        {cat.subCategories.map(subCat => (
          <SelectCategoryItem
            className="pl-10 py-2"
            key={subCat.id}
            value={`${cat.id}%${subCat.id}`}
            name={subCat.name}
            iconId={subCat.iconId}
          />
        ))}
      </div>
    ))}
  </TabsContent>
);

interface SelectCategoryItemProps {
  className?: string;
  value: string;
  name: string;
  iconId: number;
}

const SelectCategoryItem = (props: SelectCategoryItemProps) => (
  <SelectItem value={props.value} className={props.className}>
    <AppIcon className="rounded-full w-8 h-8" id={props.iconId} name={props.name} />{' '}
    <span className="text-lg">{props.name}</span>
  </SelectItem>
);
