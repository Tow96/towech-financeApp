'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/shadcn-ui/components/ui/form';
import { DialogClose, DialogFooter } from '@/lib/shadcn-ui/components/ui/dialog';
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

import { useAddCategory } from '@/lib/categories/data-store/use-add-categories';
import { CategoryType } from '@/lib/categories/data-store';
import { Dispatch, SetStateAction } from 'react';

// ----------------------------------------------
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' }),
  type: z.nativeEnum(CategoryType, { required_error: 'Please select a type.' }),
  iconId: z.number(),
});

interface AddCategoryFormProps {
  setDialog?: Dispatch<SetStateAction<boolean>>;
}

export const AddCategoryForm = (props: AddCategoryFormProps) => {
  const addCategoryMutation = useAddCategory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      iconId: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addCategoryMutation.mutate(values);

    if (props.setDialog) props.setDialog(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form content */}
        <div className="flex items-center gap-5 py-5">
          {/* Icon */}
          <AppIconSelector />

          {/* Inputs */}
          <div className="grid gap-3 flex-1">
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CategoryType.income}>Income</SelectItem>
                      <SelectItem value={CategoryType.expense}>Expense</SelectItem>
                      <SelectItem value={CategoryType.transfer}>Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
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

        {/* Form close */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
