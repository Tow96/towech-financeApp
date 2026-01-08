import { useMutation, useQuery } from '@tanstack/react-query'

import { getUser, signOutSession } from '@/core/functions'

// Queries --------------------------------------
export const useUserDetail = () => {
	return useQuery({
		queryKey: ['user', 'detail'],
		gcTime: 1000, // If there are no watchers, it's very likely the user signed out
		queryFn: () => getUser(),
	})
}

// Mutations ------------------------------------
export const useSignOutMutation = () => {
	return useMutation({
		mutationFn: () => signOutSession(),
	})
}
