import { mainSchema } from '@/lib/database';

type SummaryValueObject = typeof mainSchema.MovementSummary.$inferSelect;

export type MovementEntity = typeof mainSchema.Movements.$inferSelect & {
  summary: SummaryValueObject[];
};
