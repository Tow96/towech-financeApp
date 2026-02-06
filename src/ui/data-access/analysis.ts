import { useQuery } from '@tanstack/react-query'
import { graphKeys } from '../utils'
import { getBalanceAnalysis } from '@/core/functions'

// Queries --------------------------------------
export const useBalanceAnalysis = () => {
	return useQuery({
		queryKey: graphKeys.balance(),
		queryFn: () => getBalanceAnalysis(),
	})
}
