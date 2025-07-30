'use client';
import { useState, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/shadcn-ui/components/ui/form';
import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { Input } from '@/lib/shadcn-ui/components/ui/input';

import { useAddMovement } from '@/lib/movements/data-store';
import { AddMovementFormSchema, addMovementFormDefaultValues } from './form-schema';
import { FormDialog } from '@/lib/webclient';
import { Features as CategoryFeatures } from '@/lib/categories';
import { Features as WalletFeatures } from '@/lib/wallets';
import { CategoryType } from '@/lib/categories/data-store';
import { convertValueToCents } from '@/lib/utils';
import { DatePicker } from '@/lib/webclient/datepicker';

export const AddMovementDialog = (): ReactNode => {
  const [open, setOpen] = useState(false);
  const addMovementMutation = useAddMovement();

  const form = useForm<AddMovementFormSchema>({
    resolver: zodResolver(AddMovementFormSchema),
    defaultValues: addMovementFormDefaultValues,
  });

  const onSubmit = (values: AddMovementFormSchema) => {
    addMovementMutation.mutate(
      {
        ...values,
        summary: [
          {
            amount: convertValueToCents(Number(values.summary.amount)),
            wallet: {
              originId:
                values.category.type === CategoryType.income
                  ? null
                  : values.summary.wallet.originId,
              destinationId:
                values.category.type === CategoryType.expense
                  ? null
                  : values.summary.wallet.destinationId,
            },
          },
        ],
      },
      { onSuccess: onSubmitSuccess }
    );
  };
  const onSubmitSuccess = () => {
    const lastDate = new Date(form.watch().date);
    lastDate.setSeconds(lastDate.getSeconds() + 1);

    form.reset();
    form.setValue('date', lastDate); // Ensure last date is remembered
    setOpen(false);
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
          name="summary.amount"
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
            name="summary.wallet.originId"
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
            name="summary.wallet.destinationId"
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
              name="summary.wallet.originId"
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
              name="summary.wallet.destinationId"
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
              <DatePicker {...field} />
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
