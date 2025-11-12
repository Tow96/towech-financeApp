import { useQuery } from '@tanstack/react-query'

import { movementKeys } from '@/features/movements/store-keys'
import { getPeriodMovementList } from '@/features/movements/list-movements/server.ts'

export const usePeriodMovements = (start: Date) => {
	return useQuery({
		queryKey: movementKeys.list(start),
		staleTime: 60000,
		queryFn: () => getPeriodMovementList({ data: { periodStart: start } }),
	})
}
