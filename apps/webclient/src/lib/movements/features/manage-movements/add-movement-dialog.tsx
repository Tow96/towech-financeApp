'use client';
import { useState, ReactNode } from 'react';
import { Plus } from 'lucide-react';
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
import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { Input } from '@/lib/shadcn-ui/components/ui/input';

import { FormDialog } from '@/lib/webclient';
import { useAddMovement } from '@/lib/movements/data-store';

export const AddMovementDialog = (): ReactNode => {
  const [open, setOpen] = useState(false);
  const addMovementMutation = useAddMovement();

  const formSchema = z.object({
    categoryId: z.string(),
    subCategoryId: z.string().nullable(),
    date: z.date(),
    description: z
      .string()
      .min(1, { message: 'Description cannot be empty. ' })
      .max(140, { message: 'Description cannot exceed 140 characters.' }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: '94a19c1e-4b97-4236-aa99-9640be42c24b',
      subCategoryId: null,
      date: new Date(),
      description: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    addMovementMutation.mutate(values, { onSuccess: () => setOpen(false) });

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add Movement
      </Button>
      <FormDialog
        open={open}
        setOpen={setOpen}
        title={'Add Movement'}
        form={form}
        onSubmit={onSubmit}
        error={addMovementMutation.error}
        loading={addMovementMutation.isPending}>
        {/* Description */}
        <FormField
          control={form.control}
          disabled={addMovementMutation.isPending}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </FormDialog>
    </>
  );
};
