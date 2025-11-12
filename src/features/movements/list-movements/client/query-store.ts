import { useQuery } from '@tanstack/react-query'

import { movementKeys } from '@/features/movements/store-keys'
import { getPeriodMovementList } from '@/features/movements/list-movements/server.ts'

export const usePeriodMovements = (walletId: string | undefined, start: Date) => {
	return useQuery({
		queryKey: movementKeys.list(walletId, start),
		staleTime: 60000,
		queryFn: () => getPeriodMovementList({ data: { walletId, periodStart: start } }),
	})
}
