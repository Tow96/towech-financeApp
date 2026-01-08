import { useQuery } from '@tanstack/react-query'

import { getMovementDetail } from '@/core/functions'

import { movementKeys } from '@/features/movements/store-keys'

export const useMovementDetail = (id: string) => {
	return useQuery({
		queryKey: movementKeys.detail(id),
		staleTime: 60000,
		queryFn: () => getMovementDetail({ data: { id } }),
	})
}
