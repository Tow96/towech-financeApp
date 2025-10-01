'use client';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormDialog } from '@/lib/webclient';
import { SubCategoryDto, useRestoreSubCategory } from '@/lib/categories/data-store';

// ----------------------------------------------
interface RestoreSubCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentId: string;
  subCategory: SubCategoryDto;
}

export const RestoreSubCategoryDialog = (props: RestoreSubCategoryDialogProps): ReactNode => {
  const restoreSubCategoryMutation = useRestoreSubCategory();

  const formSchema = z.object({ id: z.string(), parentId: z.string() });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: props.subCategory.id, parentId: props.parentId },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    restoreSubCategoryMutation.mutate(values, { onSettled: () => props.setOpen(false) });

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title={'Restore SubCategory'}
      form={form}
      onSubmit={onSubmit}
      error={restoreSubCategoryMutation.error}
      loading={restoreSubCategoryMutation.isPending}>
      <p>Are you sure?</p>
    </FormDialog>
  );
};
