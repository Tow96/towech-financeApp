'use client';
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
import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { Input } from '@/lib/shadcn-ui/components/ui/input';
import { AppIconSelector } from '@/lib/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/shadcn-ui/components/ui/select';

import { CategoryDto, useEditCategory } from '@/lib/categories/data-store';
import { ErrorBox } from '@/lib/webclient';

// ----------------------------------------------
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name cannot exceed 50 characters long.' }),
  iconId: z.number(),
});

interface EditCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: CategoryDto;
}

export const EditCategoryDialog = (props: EditCategoryDialogProps) => {
  const editCategoryMutation = useEditCategory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.category.name,
      iconId: props.category.iconId,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    editCategoryMutation.mutate({ ...values, id: props.category.id });
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogDescription className="sr-only">Edit Category</DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

            {editCategoryMutation.isError && (
              <ErrorBox
                className="mb-4"
                title="Failed to create category"
                error={editCategoryMutation.error}
              />
            )}

            {/* Form close */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={editCategoryMutation.isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={editCategoryMutation.isPending}>
                {editCategoryMutation.isPending && <Loader2Icon className="animate-spin" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
