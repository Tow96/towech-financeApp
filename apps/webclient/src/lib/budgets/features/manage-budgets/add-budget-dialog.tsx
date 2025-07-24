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
import { cn } from '@/lib/shadcn-ui/utils';

import { FormDialog } from '@/lib/webclient';
import { useCategories } from '@/lib/categories/data-store';
import { useAddBudget } from '@/lib/budgets/data-store';

export const AddBudgetDialog = (): ReactNode => {
  const [open, setOpen] = useState(false);
  const addBudgetMutation = useAddBudget();

  const formSchema = z.object({
    year: z.number(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add Budget
      </Button>
      <FormDialog
        open={open}
        setOpen={setOpen}
        title="Add Budget"
        form={form}
        onSubmit={onSubmit}
        error={addBudgetMutation.error}
        loading={addBudgetMutation.isPending}>
        ADD FORM
      </FormDialog>
    </>
  );
};
