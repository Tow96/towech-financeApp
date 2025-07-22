'use client';
import { ReactNode, useState } from 'react';

import { CategoryDto, CategoryType, useCategories } from '@/lib/categories/data-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/shadcn-ui/components/ui/select';
import { AppIcon } from '@/lib/icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/lib/shadcn-ui/components/ui/tabs';
import { Control, useController } from 'react-hook-form';

interface CategorySelectorValue {
  id: string;
  subCategory: string | null;
  type: CategoryType;
  name: string;
  iconId: number;
}

interface CategorySelectorProps {
  className?: string;
  control?: Control;
  name?: string;
  disabled?: boolean;
}

const VALUE_SEPARATOR = '%';

export const CategorySelector = (props: CategorySelectorProps): ReactNode => {
  const categories = useCategories();
  const {
    field: { onChange, value },
  } = useController({ name: props.name || '', control: props.control });

  const [selectedCategory, setSelectedCategory] = useState<CategorySelectorValue>(
    value || { id: '', subCategory: null, iconId: 0, name: '', type: CategoryType.expense }
  );

  const handleOnChange = (v: string) => {
    const splitValue = v.split(VALUE_SEPARATOR);
    const id = splitValue[0];
    const subCategory = splitValue[1] || null;

    const selectedCategory = categories.data?.find(c => c.id === id);

    const type = selectedCategory?.type || CategoryType.expense;

    const name =
      subCategory === null
        ? selectedCategory?.name || ''
        : selectedCategory?.subCategories.find(sC => sC.id === subCategory)?.name || '';
    const iconId =
      subCategory === null
        ? selectedCategory?.iconId || 0
        : selectedCategory?.subCategories.find(sC => sC.id === subCategory)?.iconId || 0;

    const value: CategorySelectorValue = { id, subCategory, type, name, iconId };

    setSelectedCategory(value);
    onChange(value);
  };

  return (
    <Select disabled={props.disabled} onValueChange={handleOnChange}>
      <SelectTrigger className="w-full !h-12">
        <SelectValue placeholder="Select a category">
          <AppIcon
            className="rounded-full w-8 h-8"
            id={selectedCategory.iconId}
            name={selectedCategory.name}
          />
          <span className="text-lg">{selectedCategory.name}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <Tabs defaultValue="expense">
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
    <AppIcon className="rounded-full w-8 h-8" id={props.iconId} name={props.name} />
    <span className="text-lg">{props.name}</span>
  </SelectItem>
);
