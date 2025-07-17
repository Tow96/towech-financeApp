'use client';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/shadcn-ui/components/ui/select';

import { FormDialog } from '@/lib/webclient';
import { CategoryDto, useEditCategory } from '@/lib/categories/data-store';

// ----------------------------------------------
interface EditCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: CategoryDto;
}

export const EditCategoryDialog = (props: EditCategoryDialogProps) => {
  const editCategoryMutation = useEditCategory();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long.' })
      .max(50, { message: 'Name cannot exceed 50 characters long.' }),
    iconId: z.number(),
    id: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.category.name,
      iconId: props.category.iconId,
      id: props.category.id,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    editCategoryMutation.mutate(values, { onSuccess: () => props.setOpen(false) });

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title="Edit Category"
      form={form}
      onSubmit={onSubmit}
      error={editCategoryMutation.error}
      loading={editCategoryMutation.isPending}>
      {/* Form content */}
      <div className="flex items-center gap-5 py-5">
        {/* Icon */}
        <AppIconSelector />

        {/* Inputs */}
        <div className="grid gap-3 flex-1">
          {/* Type read-only */}
          <Select defaultValue="base" disabled={true}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="base">{props.category.type.toLowerCase()}</SelectItem>
            </SelectContent>
          </Select>
          {/* Name */}
          <FormField
            control={form.control}
            disabled={editCategoryMutation.isPending}
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
