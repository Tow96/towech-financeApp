'use client';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/shadcn-ui/components/ui/form';
import { Input } from '@/lib/shadcn-ui/components/ui/input';

import { useEditMovement } from '@/lib/movements/data-store/use-edit-movement';
import { editMovementFormDefaultValues, EditMovementFormSchema } from './form-schema';
import { FormDialog } from '@/lib/webclient';
import { Features as CategoryFeatures } from '@/lib/categories';
import { Features as WalletFeatures } from '@/lib/wallets';
import { CategoryType } from '@/lib/categories/data-store';
import { convertValueToCents } from '@/lib/utils';
import { DatePicker } from '@/lib/webclient/datepicker';
import { MovementDto } from '@/lib/movements/data-store';

interface EditMovementDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  movement: MovementDto;
}

export const EditMovementDialog = (props: EditMovementDialogProps): ReactNode => {
  const editMovementMutation = useEditMovement();

  const form = useForm<EditMovementFormSchema>({
    resolver: zodResolver(EditMovementFormSchema),
    defaultValues: editMovementFormDefaultValues(props.movement),
  });

  const onSubmit = (values: EditMovementFormSchema) => {
    editMovementMutation.mutate(
      {
        ...values,
        date: values.date.toISOString(),
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
      { onSuccess: () => internalSetOpen(false) }
    );
  };

  const internalSetOpen = (open: boolean) => {
    form.reset();
    props.setOpen(open);
  };

  return (
    <FormDialog
      open={props.open}
      setOpen={internalSetOpen}
      title="Edit Movement"
      form={form}
      onSubmit={onSubmit}
      error={editMovementMutation.error}
      loading={editMovementMutation.isPending}>
      {/* Amount */}
      <FormField
        control={form.control}
        disabled={editMovementMutation.isPending}
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
        disabled={editMovementMutation.isPending}
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
  );
};
