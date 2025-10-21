import { mainSchema } from '@/lib/database';

export type WalletEntity = typeof mainSchema.Wallets.$inferSelect;
