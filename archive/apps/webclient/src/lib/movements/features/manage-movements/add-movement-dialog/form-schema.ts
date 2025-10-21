import { z } from 'zod';
import { CategoryType } from '@/lib/categories/data-store';

const AddMovementFormSchema = z.object({
  date: z.date(),
  description: z
    .string()
    .min(1)
    .max(140)
    .transform(v => v.trim()),
  category: z.object({
    type: z.enum(CategoryType),
    id: z.string().min(1).nullable(),
    subId: z.string().min(1).nullable(),
  }),
  summary: z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a number with up to two decimal places'),
    wallet: z.object({
      originId: z.string().min(1).nullable(),
      destinationId: z.string().min(1).nullable(),
    }),
  }),
});

type AddMovementFormSchema = z.infer<typeof AddMovementFormSchema>;

const addMovementFormDefaultValues: AddMovementFormSchema = {
  date: new Date(),
  description: '',
  category: {
    type: CategoryType.expense,
    id: null,
    subId: null,
  },
  summary: {
    amount: '',
    wallet: {
      originId: null,
      destinationId: null,
    },
  },
};

export { AddMovementFormSchema, addMovementFormDefaultValues };
