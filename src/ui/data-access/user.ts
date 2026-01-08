import { useQuery } from '@tanstack/react-query'

import { getUser } from '@/core/functions'

// Queries --------------------------------------
export const useUserDetail = () => {
	return useQuery({
		queryKey: ['user', 'detail'],
		gcTime: 1000, // If there are no watchers, it's very likely the user signed out
		queryFn: () => getUser(),
	})
}

