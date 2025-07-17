'use client';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormDialog } from '@/lib/webclient';
import { CategoryDto, useRestoreCategory } from '@/lib/categories/data-store';

// ----------------------------------------------
interface RestoreCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: CategoryDto;
}

export const RestoreCategoryDialog = (props: RestoreCategoryDialogProps): ReactNode => {
  const restoreCategoryMutation = useRestoreCategory();

  const formSchema = z.object({ id: z.string() });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: props.category.id },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    restoreCategoryMutation.mutate(values.id, { onSettled: () => props.setOpen(false) });

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title="Restore Category"
      form={form}
      onSubmit={onSubmit}
      error={restoreCategoryMutation.error}
      loading={restoreCategoryMutation.isPending}>
      <p>Are you sure?</p>
    </FormDialog>
  );
};
