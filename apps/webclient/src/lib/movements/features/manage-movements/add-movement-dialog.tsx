'use client';
import { useState, ReactNode } from 'react';
import { CalendarIcon, Plus } from 'lucide-react';
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
import { Calendar } from '@/lib/shadcn-ui/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shadcn-ui/components/ui/popover';
import { cn } from '@/lib/shadcn-ui/utils';

import { FormDialog } from '@/lib/webclient';
import { useAddMovement } from '@/lib/movements/data-store';
import { Features as CategoryFeatures } from '@/lib/categories';
import { Features as WalletFeatures } from '@/lib/wallets';
import { CategoryType } from '@/lib/categories/data-store';

export const AddMovementDialog = (): ReactNode => {
  const [open, setOpen] = useState(false);
  const addMovementMutation = useAddMovement();

  const formSchema = z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a number with up to two decimal places'),
    category: z.object({
      id: z.string().min(1, { message: 'Select a category' }),
      subCategory: z.string().nullable(),
      type: z.enum(CategoryType),
      name: z.string(),
      iconId: z.number(),
    }),
    date: z.date(),
    description: z
      .string()
      .min(1, { message: 'Description cannot be empty. ' })
      .max(140, { message: 'Description cannot exceed 140 characters.' }),
    from: z.object({
      id: z.string().nullable(),
      name: z.string(),
      iconId: z.number(),
    }),
    to: z.object({
      id: z.string().nullable(),
      name: z.string(),
      iconId: z.number(),
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      category: {
        id: '',
        subCategory: null,
        name: '',
        iconId: 0,
        type: CategoryType.expense,
      },
      date: new Date(),
      description: '',
      from: {
        id: '',
        iconId: 0,
        name: '',
      },
      to: {
        id: '',
        iconId: 0,
        name: '',
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addMovementMutation.mutate(
      {
        categoryId: values.category.id,
        subCategoryId: values.category.subCategory,
        date: values.date,
        description: values.description,
        summary: [
          {
            originWalletId: values.category.type === CategoryType.income ? null : values.from.id,
            destinationWalletId:
              values.category.type === CategoryType.expense ? null : values.to.id,
            amount: Math.round(Number(values.amount) * 100),
          },
        ],
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
        {/* Amount */}
        <FormField
          control={form.control}
          disabled={addMovementMutation.isPending}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <CategoryFeatures.CategorySelector {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Wallet*/}
        {form.watch().category.type === CategoryType.expense && (
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet</FormLabel>
                <WalletFeatures.WalletSelector {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch().category.type === CategoryType.income && (
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet</FormLabel>
                <WalletFeatures.WalletSelector {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch().category.type === CategoryType.transfer && (
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <WalletFeatures.WalletSelector {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <WalletFeatures.WalletSelector {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Date selector */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(!field.value && 'text-muted-foreground')}>
                      {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
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
              <FormMessage />
            </FormItem>
          )}
        />
      </FormDialog>
    </>
  );
};
