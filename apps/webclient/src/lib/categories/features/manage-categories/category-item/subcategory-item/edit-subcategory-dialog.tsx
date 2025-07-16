'use client';
import { useState, ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AlertCircleIcon, Loader2Icon } from 'lucide-react';

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
import { Alert, AlertDescription, AlertTitle } from '@/lib/shadcn-ui/components/ui/alert';

import { SubCategoryDto, useEditSubCategory } from '@/lib/categories/data-store';
import { AppIconSelector } from '@/lib/icons';
import { Input } from '@/lib/shadcn-ui/components/ui/input';
import { Button } from '@/lib/shadcn-ui/components/ui/button';

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
  const [errorBox, setErrorBox] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.subCategory.name,
      iconId: props.subCategory.iconId,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorBox(null);
    const data = await editSubCategoryMutation.mutateAsync({
      ...values,
      id: props.subCategory.id,
      parentId: props.parentId,
    });

    if (!data.errors) return props.setOpen(false);
    setErrorBox((Object.values(data.errors) as string[]).join('\n'));
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

            {/* Error box */}
            {errorBox !== null && (
              <Alert variant="destructive" className="mb-5">
                <AlertCircleIcon />
                <AlertTitle>Failed to create category</AlertTitle>
                <AlertDescription> {errorBox} </AlertDescription>
              </Alert>
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
