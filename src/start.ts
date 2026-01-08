import { createStart } from '@tanstack/react-start'

import { loggingMiddleware } from '@/core/functions'

export const startInstance = createStart(() => {
	return {
		requestMiddleware: [loggingMiddleware],
	}
})
