'use client';
import { useState, ReactNode } from 'react';
import { Plus } from 'lucide-react';
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
import { cn } from '@/lib/shadcn-ui/utils';

import { FormDialog } from '@/lib/webclient';
import { useAddBudget } from '@/lib/budgets/data-store';
import { addBudgetFormDefaultValues, AddBudgetFormSchema } from './form-schema';

export const AddBudgetDialog = (): ReactNode => {
  const [open, setOpen] = useState(false);
  const addBudgetMutation = useAddBudget();

  const form = useForm<AddBudgetFormSchema>({
    resolver: zodResolver(AddBudgetFormSchema),
    defaultValues: addBudgetFormDefaultValues,
  });
  const summaryFieldArray = useFieldArray({ control: form.control, name: 'summary' });

  const onSubmit = (values: AddBudgetFormSchema) => console.log(values);

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

        {summaryFieldArray.fields.map((field, index) => (
          <div key={field.id}>
            pepe
          </div>
        ))}

      </FormDialog>
    </>
  );
};
