'use client';
import { useState } from 'react';
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

import { FormDialog } from '@/lib/webclient';
import { CategoryType, useAddCategory } from '@/lib/categories/data-store';

import { AppIconSelector } from '@/lib/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/shadcn-ui/components/ui/select';
import { Input } from '@/lib/shadcn-ui/components/ui/input';

export const AddCategoryButton = () => {
  const [open, setOpen] = useState(false);
  const addCategoryMutation = useAddCategory();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long.' })
      .max(50, { message: 'Name cannot exceed 50 characters.' }),
    type: z.enum(CategoryType),
    iconId: z.number(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      iconId: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    addCategoryMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add Category
      </Button>
      <FormDialog
        open={open}
        setOpen={setOpen}
        title="Add Category"
        form={form}
        onSubmit={onSubmit}
        error={addCategoryMutation.error}
        loading={addCategoryMutation.isPending}>
        <div className="flex items-center gap-5 py-5">
          {/* Icon */}
          <FormField
            control={form.control}
            disabled={addCategoryMutation.isPending}
            name="iconId"
            render={({ field }) => <AppIconSelector {...field} />}
          />

          {/* Inputs */}
          <div className="grid gap-3 flex-1">
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={addCategoryMutation.isPending}>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CategoryType.income}>Income</SelectItem>
                      <SelectItem value={CategoryType.expense}>Expense</SelectItem>
                      <SelectItem value={CategoryType.transfer}>Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              disabled={addCategoryMutation.isPending}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </FormDialog>
    </>
  );
};
