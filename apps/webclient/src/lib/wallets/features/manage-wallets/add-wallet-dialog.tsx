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

import { FormDialog } from '@/lib/webclient';
import { useAddWallet } from '@/lib/wallets/data-store';
import { AppIconSelector } from '@/lib/icons';
import { Input } from '@/lib/shadcn-ui/components/ui/input';

export const AddWalletDialog = (): ReactNode => {
  const [open, setOpen] = useState(false);
  const addWalletMutation = useAddWallet();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long.' })
      .max(50, { message: 'Name cannot exceed 50 characters.' }),
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
    addWalletMutation.mutate(values, { onSuccess: () => setOpen(false) });

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add Wallet
      </Button>
      <FormDialog
        open={open}
        setOpen={setOpen}
        title="Add Wallet"
        form={form}
        onSubmit={onSubmit}
        error={addWalletMutation.error}
        loading={addWalletMutation.isPending}>
        <div className="flex items-center gap-5 py-5">
          {/* Icon */}
          <FormField
            control={form.control}
            disabled={addWalletMutation.isPending}
            name="iconId"
            render={({ field }) => <AppIconSelector {...field} />}
          />

          {/* Name */}
          <FormField
            control={form.control}
            disabled={addWalletMutation.isPending}
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
        </div>
      </FormDialog>
    </>
  );
};
