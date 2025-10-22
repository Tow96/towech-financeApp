// Override of the start to implement middleware
import { createStart } from '@tanstack/react-start'
import { loggingMiddleware } from '@/features/logging/http-log.middleware.ts'


export const startInstance = createStart(() => {
	return {
		requestMiddleware: [loggingMiddleware],
	}
})