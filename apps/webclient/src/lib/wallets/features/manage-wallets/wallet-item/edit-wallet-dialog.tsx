'use client';
import { ReactNode } from 'react';
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
import { Input } from '@/lib/shadcn-ui/components/ui/input';
import { AppIconSelector } from '@/lib/icons';

import { FormDialog } from '@/lib/webclient';
import { WalletDto, useEditWallet } from '@/lib/wallets/data-store';

interface EditWalletDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  wallet: WalletDto;
}

export const EditWalletDialog = (props: EditWalletDialogProps): ReactNode => {
  const editWalletMutation = useEditWallet();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long.' })
      .max(50, { message: 'Name cannot exceed 50 characters.' }),
    iconId: z.number(),
    id: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.wallet.name,
      iconId: props.wallet.iconId,
      id: props.wallet.id,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    editWalletMutation.mutate(values, { onSuccess: () => props.setOpen(false) });

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title="Edit wallet"
      form={form}
      onSubmit={onSubmit}
      error={editWalletMutation.error}
      loading={editWalletMutation.isPending}>
      <div className="flex items-center gap-5 py-5">
        {/* Icon */}
        <FormField
          control={form.control}
          disabled={editWalletMutation.isPending}
          name="iconId"
          render={({ field }) => <AppIconSelector {...field} />}
        />

        {/* Name */}
        <FormField
          control={form.control}
          disabled={editWalletMutation.isPending}
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
  );
};
