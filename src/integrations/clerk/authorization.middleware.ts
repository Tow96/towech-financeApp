import { createMiddleware } from '@tanstack/react-start'
import { auth, clerkMiddleware } from '@clerk/tanstack-react-start/server'

export const getUserId = async () => {
	const mockId = process.env.VITE_MOCK_USER_ID
	if (mockId !== undefined && mockId.trim() !== '') return mockId

	const { userId } = await auth()
	return userId
}

export const AuthorizationMiddleware = createMiddleware().server(async ({ next }) => {
	const userId = await getUserId()
	if (!userId) throw new Error('Not authorized')
	return next({ context: { userId } })
})

export const customClerkMiddleware = () => {
	const mockId = import.meta.env.VITE_MOCK_USER_ID
	const disabledUsers = mockId !== undefined && mockId.trim() !== ''

	if (!disabledUsers) return clerkMiddleware()

	return createMiddleware().server(({ next }) => next())
}
