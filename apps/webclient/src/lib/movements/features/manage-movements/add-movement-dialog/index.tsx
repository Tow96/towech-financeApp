'use client';
import { useState, ReactNode } from 'react';
import { CalendarIcon, Plus } from 'lucide-react';
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
import { Calendar } from '@/lib/shadcn-ui/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shadcn-ui/components/ui/popover';
import { cn } from '@/lib/shadcn-ui/utils';

import { useAddMovement } from '@/lib/movements/data-store';
import { AddMovementFormSchema, addMovementFormDefaultValues } from './form-schema';
import { FormDialog } from '@/lib/webclient';
import { Features as CategoryFeatures } from '@/lib/categories';
import { Features as WalletFeatures } from '@/lib/wallets';
import { CategoryType } from '@/lib/categories/data-store';
import { convertValueToCents } from '@/lib/utils';

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
            wallet: values.summary.wallet,
          },
        ],
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
        {/*  /!* Category *!/*/}
        {/*  <FormField*/}
        {/*    control={form.control}*/}
        {/*    name="category"*/}
        {/*    render={({ field }) => (*/}
        {/*      <FormItem>*/}
        {/*        <FormLabel>Category</FormLabel>*/}
        {/*        <CategoryFeatures.CategorySelector {...field} />*/}
        {/*        <FormMessage />*/}
        {/*      </FormItem>*/}
        {/*    )}*/}
        {/*  />*/}
        {/*  /!* Wallet*!/*/}
        {/*  {form.watch().category.type === CategoryType.expense && (*/}
        {/*    <FormField*/}
        {/*      control={form.control}*/}
        {/*      name="from"*/}
        {/*      render={({ field }) => (*/}
        {/*        <FormItem>*/}
        {/*          <FormLabel>Wallet</FormLabel>*/}
        {/*          <WalletFeatures.WalletSelector {...field} />*/}
        {/*          <FormMessage />*/}
        {/*        </FormItem>*/}
        {/*      )}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*  {form.watch().category.type === CategoryType.income && (*/}
        {/*    <FormField*/}
        {/*      control={form.control}*/}
        {/*      name="to"*/}
        {/*      render={({ field }) => (*/}
        {/*        <FormItem>*/}
        {/*          <FormLabel>Wallet</FormLabel>*/}
        {/*          <WalletFeatures.WalletSelector {...field} />*/}
        {/*          <FormMessage />*/}
        {/*        </FormItem>*/}
        {/*      )}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*  {form.watch().category.type === CategoryType.transfer && (*/}
        {/*    <div className="flex gap-2">*/}
        {/*      <FormField*/}
        {/*        control={form.control}*/}
        {/*        name="from"*/}
        {/*        render={({ field }) => (*/}
        {/*          <FormItem>*/}
        {/*            <FormLabel>From</FormLabel>*/}
        {/*            <WalletFeatures.WalletSelector {...field} />*/}
        {/*            <FormMessage />*/}
        {/*          </FormItem>*/}
        {/*        )}*/}
        {/*      />*/}

        {/*      <FormField*/}
        {/*        control={form.control}*/}
        {/*        name="to"*/}
        {/*        render={({ field }) => (*/}
        {/*          <FormItem>*/}
        {/*            <FormLabel>To</FormLabel>*/}
        {/*            <WalletFeatures.WalletSelector {...field} />*/}
        {/*            <FormMessage />*/}
        {/*          </FormItem>*/}
        {/*        )}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  )}*/}

        {/*  /!* Date selector *!/*/}
        {/*  <FormField*/}
        {/*    control={form.control}*/}
        {/*    name="date"*/}
        {/*    render={({ field }) => (*/}
        {/*      <FormItem>*/}
        {/*        <FormLabel>Date</FormLabel>*/}
        {/*        <Popover>*/}
        {/*          <PopoverTrigger asChild>*/}
        {/*            <FormControl>*/}
        {/*              <Button*/}
        {/*                variant="outline"*/}
        {/*                className={cn(!field.value && 'text-muted-foreground')}>*/}
        {/*                {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}*/}
        {/*                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />*/}
        {/*              </Button>*/}
        {/*            </FormControl>*/}
        {/*          </PopoverTrigger>*/}
        {/*          <PopoverContent className="w-auto p-0" align="start">*/}
        {/*            <Calendar*/}
        {/*              mode="single"*/}
        {/*              selected={field.value}*/}
        {/*              onSelect={field.onChange}*/}
        {/*              captionLayout="dropdown"*/}
        {/*            />*/}
        {/*          </PopoverContent>*/}
        {/*        </Popover>*/}
        {/*      </FormItem>*/}
        {/*    )}*/}
        {/*  />*/}
        {/*  /!* Description *!/*/}
        {/*  <FormField*/}
        {/*    control={form.control}*/}
        {/*    disabled={addMovementMutation.isPending}*/}
        {/*    name="description"*/}
        {/*    render={({ field }) => (*/}
        {/*      <FormItem className="flex-1">*/}
        {/*        <FormLabel>Description</FormLabel>*/}
        {/*        <FormControl>*/}
        {/*          <Input {...field} />*/}
        {/*        </FormControl>*/}
        {/*        <FormMessage />*/}
        {/*      </FormItem>*/}
        {/*    )}*/}
        {/*  />*/}
      </FormDialog>
    </>
  );
};
