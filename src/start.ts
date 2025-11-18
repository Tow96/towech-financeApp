import { createStart } from '@tanstack/react-start'

import { loggingMiddleware } from '@/features/logging/http-log.middleware'

export const startInstance = createStart(() => {
	return {
		requestMiddleware: [loggingMiddleware],
	}
})
