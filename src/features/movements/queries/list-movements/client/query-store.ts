import { useQuery } from '@tanstack/react-query'

import { getMovementList } from '@/core/functions'

import { movementKeys } from '@/features/movements/store-keys'

export const usePeriodMovements = (walletId: string | undefined, start: Date) => {
	return useQuery({
		queryKey: movementKeys.list(walletId, start),
		staleTime: 60000,
		queryFn: () => getMovementList({ data: { walletId, periodStart: start } }),
	})
}
