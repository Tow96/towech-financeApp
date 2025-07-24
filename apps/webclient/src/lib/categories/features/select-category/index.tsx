'use client';
import { ReactNode, useState } from 'react';

import { CategoryType, useCategories } from '@/lib/categories/data-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, SelectValue,
} from '@/lib/shadcn-ui/components/ui/select';
import { AppIcon } from '@/lib/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn-ui/components/ui/tabs';
import { Control, useController } from 'react-hook-form';

interface CategorySelectorValue {
  type: CategoryType;
  id: string | null;
  subId: string | null;
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
    field: { onChange },
  } = useController({ name: props.name || '', control: props.control });

  const [displayedCategory, setDisplayedCategory] = useState<{ iconId: number; name: string }>({
    iconId: 4,
    name: 'Uncategorized expense',
  });

  const handleOnChange = (v: string) => {
    const splitValue = v.split(VALUE_SEPARATOR);
    const type = splitValue[0] as CategoryType;
    const id = splitValue[1] || null;
    const subId = splitValue[2] || null;
    const value: CategorySelectorValue = { type, id, subId };
    onChange(value);

    const selectedCategory = categories.data?.find(c => c.id === id);
    const name =
      subId === null
        ? selectedCategory?.name || `Uncategorized ${type.toLowerCase()}`
        : selectedCategory?.subCategories.find(c => c.id === subId)?.name || '';
    const iconId =
      subId === null
        ? selectedCategory?.iconId || 4
        : selectedCategory?.subCategories.find(c => c.id === subId)?.iconId || 4;
    setDisplayedCategory({ name, iconId });
  };

  return (
    <Select disabled={props.disabled} onValueChange={handleOnChange}>
      <SelectTrigger className="w-full !h-12">
        <SelectValue placeholder="Select a category">
          <AppIcon
            className="rounded-full w-8 h-8"
            id={displayedCategory.iconId}
            name={displayedCategory.name}
          />
          <span className="text-lg">{displayedCategory.name}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <Tabs defaultValue="EXPENSE">
          <TabsList>
            <TabsTrigger value="INCOME">Income</TabsTrigger>
            <TabsTrigger value="EXPENSE">Expense</TabsTrigger>
            <TabsTrigger value="TRANSFER">Transfer</TabsTrigger>
          </TabsList>
          <TabsContent value="INCOME">
            <CategorySelectionList type={CategoryType.income} />
          </TabsContent>
          <TabsContent value="EXPENSE">
            <CategorySelectionList type={CategoryType.expense} />
          </TabsContent>
          <TabsContent value="TRANSFER">
            <CategorySelectionList type={CategoryType.transfer} />
          </TabsContent>
        </Tabs>
      </SelectContent>
    </Select>
  );
};

interface CategorySelectionTab {
  type: CategoryType;
}

const CategorySelectionList = (props: CategorySelectionTab): ReactNode => {
  const categories = useCategories();
  const list = (categories.data || []).filter(c => c.type === props.type);

  return (
    <>
      <SelectItem value={props.type} className="border-b-1 last:border-b-0">
        <AppIcon className="rounded-full w-8 h-8" id={4} name="Uncategorized" />
        <span className="text-lg">Uncategorized</span>
      </SelectItem>

      {list.map(cat => (
        <div key={cat.id} className="border-b-1 last:border-b-0">
          <SelectItem
            value={`${cat.type}${VALUE_SEPARATOR}${cat.id}`}
            className="border-b-1 py-2 last:border-b-0">
            <AppIcon className="rounded-full w-8 h-8" id={cat.iconId} name={cat.name} />
            <span className="text-lg">{cat.name}</span>
          </SelectItem>

          {cat.subCategories.map(subCat => (
            <SelectItem
              key={subCat.id}
              value={`${cat.type}${VALUE_SEPARATOR}${cat.id}${VALUE_SEPARATOR}${subCat.id}`}
              className="border-b-1 py-2 last:border-b-0 pl-10">
              <AppIcon className="rounded-full w-8 h-8" id={subCat.iconId} name={subCat.name} />
              <span className="text-lg">{subCat.name}</span>
            </SelectItem>
          ))}
        </div>
      ))}
    </>
  );
};
