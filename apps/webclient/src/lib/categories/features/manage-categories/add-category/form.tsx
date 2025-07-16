'use client';
import { Dispatch, SetStateAction, useState } from 'react';
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

import { CategoryType, useAddCategory } from '@/lib/categories/data-store';
import { Alert, AlertDescription, AlertTitle } from '@/lib/shadcn-ui/components/ui/alert';
import { AlertCircleIcon, Loader2Icon } from 'lucide-react';

// ----------------------------------------------
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name cannot exceed 50 characters long.' }),
  type: z.nativeEnum(CategoryType, { required_error: 'Please select a type.' }),
  iconId: z.number(),
});

interface AddCategoryFormProps {
  setDialog?: Dispatch<SetStateAction<boolean>>;
}

export const AddCategoryForm = (props: AddCategoryFormProps) => {
  const addCategoryMutation = useAddCategory();
  const [errorBox, setErrorBox] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      iconId: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorBox(null);
    const data = await addCategoryMutation.mutateAsync(values);

    if (!data.errors) {
      if (props.setDialog) props.setDialog(false);
      return;
    }
    setErrorBox((Object.values(data.errors) as string[]).join('\n'));
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
              disabled={addCategoryMutation.isPending}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={addCategoryMutation.isPending}>
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
              disabled={addCategoryMutation.isPending}
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
            <Button variant="outline" disabled={addCategoryMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={addCategoryMutation.isPending}>
            {addCategoryMutation.isPending && <Loader2Icon className="animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
