'use client';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2Icon } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/lib/shadcn-ui/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/shadcn-ui/components/ui/form';

import { SubCategoryDto, useEditSubCategory } from '@/lib/categories/data-store';
import { AppIconSelector } from '@/lib/icons';
import { Input } from '@/lib/shadcn-ui/components/ui/input';
import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { ErrorBox } from '@/lib/webclient';

// ----------------------------------------------
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name cannot exceed 50 characters long.' }),
  iconId: z.number(),
});

interface EditSubcategoriesProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentId: string;
  subCategory: SubCategoryDto;
}

export const EditSubCategoryDialog = (props: EditSubcategoriesProps): ReactNode => {
  const editSubCategoryMutation = useEditSubCategory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.subCategory.name,
      iconId: props.subCategory.iconId,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    editSubCategoryMutation.mutate({
      ...values,
      id: props.subCategory.id,
      parentId: props.parentId,
    });
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogDescription className="sr-only">Edit Subcategory</DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit SubCategory</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Form content */}
            <div className="flex items-center gap-5 py-5">
              {/* Icon */}
              <AppIconSelector />

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

            {editSubCategoryMutation.isError && (
              <ErrorBox
                className="mb-4"
                title="Failed to create category"
                error={editSubCategoryMutation.error}
              />
            )}

            {/* Form close */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={editSubCategoryMutation.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={editSubCategoryMutation.isPending}>
                {editSubCategoryMutation.isPending && <Loader2Icon className="animate-spin" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
