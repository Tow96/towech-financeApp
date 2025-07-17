'use client';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormDialog } from '@/lib/webclient';
import { CategoryDto, useArchiveCategory } from '@/lib/categories/data-store';

// ----------------------------------------------
interface ArchiveCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: CategoryDto;
}

export const ArchiveCategoryDialog = (props: ArchiveCategoryDialogProps): ReactNode => {
  const archiveCategoryMutation = useArchiveCategory();

  const formSchema = z.object({ id: z.string() });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: props.category.id },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    archiveCategoryMutation.mutate(values.id, { onSettled: () => props.setOpen(false) });

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title="Archive category"
      form={form}
      onSubmit={onSubmit}
      error={archiveCategoryMutation.error}
      loading={archiveCategoryMutation.isPending}>
      <p>
        Once archived, no new movements or budgets under this category can be made until it is
        restored.
      </p>
      <p>Are you sure?</p>
    </FormDialog>
  );
};
