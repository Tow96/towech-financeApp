import { z } from 'zod';
import { convertValueToCents } from '@/lib/utils';

const AddBudgetFormSchema = z.object({
  year: z.coerce.number<number>().min(2000),
  name: z.string().transform(v => v.trim().toLowerCase()),
  summary: z
    .array(
      z.object({
        categoryId: z.string().min(1).nullable(),
        subCategoryId: z.string().min(1).nullable(),
        limit: z.number().min(1).transform(convertValueToCents),
      })
    )
    .min(1),
});

type AddBudgetFormSchema = z.infer<typeof AddBudgetFormSchema>;

const addBudgetFormDefaultValues: AddBudgetFormSchema = {
  year: new Date().getFullYear(),
  name: `${new Date().getFullYear()} budget`,
  summary: [
    {
      categoryId: '',
      subCategoryId: null,
      limit: 0,
    },
  ],
};

export { AddBudgetFormSchema, addBudgetFormDefaultValues };
