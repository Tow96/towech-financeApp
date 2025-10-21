import { z } from 'zod';
import { CategoryType } from '@/lib/categories/data-store';

const AddBudgetFormSchema = z.object({
  year: z.coerce.number<number>().min(2000),
  name: z.string().transform(v => v.trim().toLowerCase()),
  summary: z
    .array(
      z.object({
        limit: z
          .string()
          .regex(/^\d+(\.\d{1,2})?$/, 'Must be a number with up to two decimal places'),
        category: z.object({
          type: z.enum(CategoryType),
          id: z.string().min(1).nullable(),
          subId: z.string().min(1).nullable(),
        }),
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
      limit: '',
      category: {
        type: CategoryType.income,
        id: null,
        subId: null,
      },
    },
  ],
};

export { AddBudgetFormSchema, addBudgetFormDefaultValues };
