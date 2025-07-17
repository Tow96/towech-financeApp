'use client';
import { useState } from 'react';
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
import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { Input } from '@/lib/shadcn-ui/components/ui/input';
import { AppIconSelector } from '@/lib/icons';

import { useAddSubCategory } from '@/lib/categories/data-store';
import { ErrorBox } from '@/lib/webclient';

// ----------------------------------------------
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name cannot exceed 50 characters long.' }),
  iconId: z.number(),
});

interface AddSubCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentId: string;
}

export const AddSubCategoryDialog = (props: AddSubCategoryDialogProps) => {
  const addSubCategoryMutation = useAddSubCategory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      iconId: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addSubCategoryMutation.mutate({ ...values, parentId: props.parentId });
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogDescription className="sr-only">
        Add Subcategory to ${props.parentId}
      </DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subcategory</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Form content */}
            <div className="flex items-center gap-5 py-5">
              <AppIconSelector />

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

            {addSubCategoryMutation.isError && (
              <ErrorBox
                className="mb-4"
                title="Failed to create category"
                error={addSubCategoryMutation.error}
              />
            )}

            {/* Form close */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={addSubCategoryMutation.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={addSubCategoryMutation.isPending}>
                {addSubCategoryMutation.isPending && <Loader2Icon className="animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
