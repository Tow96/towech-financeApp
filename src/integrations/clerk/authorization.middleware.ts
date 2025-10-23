import { createMiddleware } from '@tanstack/react-start'

export const AuthorizationMiddleware = createMiddleware().server(async ({ next }) => {
	return next({
		context: {
			user: 'user_30N7QHdqvW2U8TaO2wfnVZDg9Dj'
		}
	})
})
