import { useMutation } from '@tanstack/react-query'

export const useLogoutMutation = () => {
	return useMutation({
		mutationFn: () => logoutSession(),
	})
}