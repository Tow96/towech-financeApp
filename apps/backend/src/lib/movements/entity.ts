import { mainSchema } from '@/lib/database';

type MovementSummaryValueObject = typeof mainSchema.MovementSummary.$inferSelect;

export type MovementEntity = typeof mainSchema.Movements.$inferSelect & {
  summary: MovementSummaryValueObject[];
};
