import { sql } from 'drizzle-orm'

import { schema } from '@/integrations/drizzle-db'

export const FetchWalletMoneySql = sql<string>`
	SUM(CASE WHEN ${schema.MovementSummary.destinationWalletId} = ${schema.Wallets.id} THEN ${schema.MovementSummary.amount} ELSE 0 END)
	- SUM (CASE WHEN ${schema.MovementSummary.originWalletId} = ${schema.Wallets.id} THEN ${schema.MovementSummary.amount} ELSE 0 END)
`
