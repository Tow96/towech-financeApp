'use client';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormDialog } from '@/lib/webclient';
import { useAddSubCategory } from '@/lib/categories/data-store';
import { AppIconSelector } from '@/lib/icons';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/shadcn-ui/components/ui/form';
import { Input } from '@/lib/shadcn-ui/components/ui/input';

// ----------------------------------------------
interface AddSubCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentId: string;
}

export const AddSubCategoryDialog = (props: AddSubCategoryDialogProps): ReactNode => {
  const addSubCategoryMutation = useAddSubCategory();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long.' })
      .max(50, { message: 'Name cannot exceed 50 characters long.' }),
    iconId: z.number(),
    parentId: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      iconId: 0,
      parentId: props.parentId,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addSubCategoryMutation.mutate(values, { onSuccess: () => {
      form.reset();
      props.setOpen(false);
    } });
  }

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title="Add SubCategory"
      form={form}
      onSubmit={onSubmit}
      error={addSubCategoryMutation.error}
      loading={addSubCategoryMutation.isPending}>
      <div className="flex items-center gap-5 py-5">
        {/* Icon */}
        <FormField
          control={form.control}
          disabled={addSubCategoryMutation.isPending}
          name="iconId"
          render={({ field }) => <AppIconSelector {...field} />}
        />

        {/* Name */}
        <div className="grid gap-3 flex-1">
          <FormField
            control={form.control}
            disabled={addSubCategoryMutation.isPending}
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
