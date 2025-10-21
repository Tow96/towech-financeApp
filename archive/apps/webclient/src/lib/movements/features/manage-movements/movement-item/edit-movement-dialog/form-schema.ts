import { z } from 'zod';
import { CategoryType } from '@/lib/categories/data-store';
import { MovementDto } from '@/lib/movements/data-store';

const EditMovementFormSchema = z.object({
  id: z.string().min(1),
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

type EditMovementFormSchema = z.infer<typeof EditMovementFormSchema>;

const editMovementFormDefaultValues = (v: MovementDto): EditMovementFormSchema => ({
  id: v.id,
  date: new Date(v.date),
  description: v.description,
  category: {
    type: v.category.type,
    id: v.category.id,
    subId: v.category.subId,
  },
  summary: {
    amount: (v.summary[0].amount / 100).toString(),
    wallet: {
      originId: v.summary[0].wallet.originId,
      destinationId: v.summary[0].wallet.destinationId,
    },
  },
});

export { EditMovementFormSchema, editMovementFormDefaultValues };
