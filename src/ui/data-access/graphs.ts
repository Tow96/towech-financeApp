import { useQuery } from '@tanstack/react-query'
import { graphKeys } from '../utils'
import { getBalanceGraph } from '@/core/functions/graphs-get-balance'

// Queries --------------------------------------
export const useBalanceChart = () => {
	return useQuery({
		queryKey: graphKeys.balance(),
		queryFn: () => getBalanceGraph(),
	})
}

