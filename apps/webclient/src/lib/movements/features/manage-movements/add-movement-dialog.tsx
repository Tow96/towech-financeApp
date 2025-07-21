'use client';
import { useState, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { useAddMovement } from '@/lib/movements/data-store';
import { Features as CategoryFeatures } from '@/lib/categories';

export const AddMovementDialog = (): ReactNode => {
  const [open, setOpen] = useState(false);
  const addMovementMutation = useAddMovement();

  const formSchema = z.object({
    category: z.object({
      id: z.string(),
      subCategory: z.string().nullable(),
    }),
    date: z.date(),
    description: z
      .string()
      .min(1, { message: 'Description cannot be empty. ' })
      .max(140, { message: 'Description cannot exceed 140 characters.' }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: {
        id: '',
        subCategory: null,
      },
      date: new Date(),
      description: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addMovementMutation.mutate(
      {
        categoryId: values.category.id,
        subCategoryId: values.category.subCategory,
        date: values.date,
        description: values.description,
      },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add Movement
      </Button>
      <FormDialog
        open={open}
        setOpen={setOpen}
        title={'Add Movement'}
        form={form}
        onSubmit={onSubmit}
        error={addMovementMutation.error}
        loading={addMovementMutation.isPending}>
        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => <CategoryFeatures.CategorySelector {...field} />}
        />
        {/*<CategoryFeatures.CategorySelector />*/}

        {/* Description */}
        <FormField
          control={form.control}
          disabled={addMovementMutation.isPending}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </FormDialog>
    </>
  );
};
