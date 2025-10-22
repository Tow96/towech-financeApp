import { createMiddleware } from '@tanstack/react-start'

export const AuthorizationMiddleware = createMiddleware().server(async ({ next }) => {
	return next({
		context: {
			user: 'TestingUser'
		}
	})
})
