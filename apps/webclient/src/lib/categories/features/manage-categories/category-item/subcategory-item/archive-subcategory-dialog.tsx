'use client';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormDialog } from '@/lib/webclient';
import { SubCategoryDto, useArchiveSubCategory } from '@/lib/categories/data-store';

// ----------------------------------------------
interface ArchiveSubCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentId: string;
  subCategory: SubCategoryDto;
}

export const ArchiveSubCategoryDialog = (props: ArchiveSubCategoryDialogProps): ReactNode => {
  const archiveSubCategoryMutation = useArchiveSubCategory();

  const formSchema = z.object({ id: z.string(), parentId: z.string() });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: props.subCategory.id, parentId: props.parentId },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    archiveSubCategoryMutation.mutate(values, { onSettled: () => props.setOpen(false) });

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title="Archive SubCategory"
      form={form}
      onSubmit={onSubmit}
      error={archiveSubCategoryMutation.error}
      loading={archiveSubCategoryMutation.isPending}>
      <p>
        Once archived, no new movements or budgets under this category can be made until it is
        restored
      </p>
      <p>Are you sure?</p>
    </FormDialog>
  );
};
