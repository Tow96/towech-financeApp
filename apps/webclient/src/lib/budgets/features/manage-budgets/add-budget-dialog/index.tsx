'use client';
import { useState, ReactNode } from 'react';
import { Plus, Trash } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/shadcn-ui/components/ui/form';
import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { Input } from '@/lib/shadcn-ui/components/ui/input';

import { FormDialog } from '@/lib/webclient';
import { useAddBudget } from '@/lib/budgets/data-store';
import { addBudgetFormDefaultValues, AddBudgetFormSchema } from './form-schema';
import { CategoryType } from '@/lib/categories/data-store';
import { Features as CategoryFeatures } from '@/lib/categories';
import { convertValueToCents } from '@/lib/utils';

export const AddBudgetDialog = (): ReactNode => {
  const [open, setOpen] = useState(false);
  const addBudgetMutation = useAddBudget();

  const form = useForm<AddBudgetFormSchema>({
    resolver: zodResolver(AddBudgetFormSchema),
    defaultValues: addBudgetFormDefaultValues,
  });
  const summaryFieldArray = useFieldArray({ control: form.control, name: 'summary' });

  const onSubmit = (values: AddBudgetFormSchema) => {
    addBudgetMutation.mutate(
      {
        year: values.year,
        name: values.name,
        summary: values.summary.map(s => ({
          month: 0,
          category: s.category,
          limit: convertValueToCents(Number(s.limit)),
        })),
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add Budget
      </Button>
      <FormDialog
        open={open}
        setOpen={setOpen}
        title="Add Budget"
        form={form}
        onSubmit={onSubmit}
        error={addBudgetMutation.error}
        loading={addBudgetMutation.isPending}>
        {JSON.stringify(form.formState.errors)}
        {/* Year */}
        <FormField
          control={form.control}
          disabled={addBudgetMutation.isPending}
          name="year"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control}
          disabled={addBudgetMutation.isPending}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {summaryFieldArray.fields.map((fieldItem, index) => (
          <div key={fieldItem.id} className="flex">
            <FormField
              control={form.control}
              name={`summary.${index}.category`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <CategoryFeatures.CategorySelector {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`summary.${index}.limit`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Limit</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button onClick={() => summaryFieldArray.remove(index)}>
              <Trash />
            </Button>
          </div>
        ))}
        <Button
          onClick={() =>
            summaryFieldArray.append({
              limit: '',
              category: { type: CategoryType.expense, id: null, subId: null },
            })
          }>
          <Plus /> Add category
        </Button>
      </FormDialog>
    </>
  );
};
