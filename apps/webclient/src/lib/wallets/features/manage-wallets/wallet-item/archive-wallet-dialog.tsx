'use client';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormDialog } from '@/lib/webclient';
import { WalletDto, useArchiveWallet } from '@/lib/wallets/data-store';

interface ArchiveWalletDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  wallet: WalletDto;
  restore: boolean;
}

export const ArchiveWalletDialog = (props: ArchiveWalletDialogProps): ReactNode => {
  const archiveWalletMutation = useArchiveWallet();

  const formSchema = z.object({ id: z.string(), restore: z.boolean() });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: props.wallet.id, restore: props.restore },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    archiveWalletMutation.mutate(values, { onSettled: () => props.setOpen(false) });

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title={props.wallet.archived ? 'Restore wallet' : 'Archive wallet'}
      form={form}
      onSubmit={onSubmit}
      error={archiveWalletMutation.error}
      loading={archiveWalletMutation.isPending}>
      {!props.wallet.archived && (
        <p>
          Once archived, no new movements using these wallet can be created until it is restored.
        </p>
      )}
      <p>Are you sure?</p>
    </FormDialog>
  );
};
