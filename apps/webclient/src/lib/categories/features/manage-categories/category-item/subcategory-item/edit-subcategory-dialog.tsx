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

import { SubCategoryDto, useEditSubCategory } from '@/lib/categories/data-store';
import { AppIconSelector } from '@/lib/icons';
import { Input } from '@/lib/shadcn-ui/components/ui/input';
import { FormDialog } from '@/lib/webclient';

// ----------------------------------------------
interface EditSubcategoriesProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentId: string;
  subCategory: SubCategoryDto;
}

export const EditSubCategoryDialog = (props: EditSubcategoriesProps): ReactNode => {
  const editSubCategoryMutation = useEditSubCategory();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long.' })
      .max(50, { message: 'Name cannot exceed 50 characters long.' }),
    iconId: z.number(),
    id: z.string(),
    parentId: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.subCategory.name,
      iconId: props.subCategory.iconId,
      id: props.subCategory.id,
      parentId: props.parentId,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    editSubCategoryMutation.mutate(values, { onSuccess: () => props.setOpen(false) });

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title="Edit Subcategory"
      form={form}
      onSubmit={onSubmit}
      error={editSubCategoryMutation.error}
      loading={editSubCategoryMutation.isPending}>
      <div className="flex items-center gap-5 py-5">
        {/* Icon */}
        <FormField
          control={form.control}
          disabled={editSubCategoryMutation.isPending}
          name="iconId"
          render={({ field }) => <AppIconSelector {...field} />}
        />

        {/* Inputs */}
        <div className="grid gap-3 flex-1">
          {/* Name */}
          <FormField
            control={form.control}
            disabled={editSubCategoryMutation.isPending}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </FormDialog>
  );
};
