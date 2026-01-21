import { v4 as uuidV4 } from 'uuid'
import { createMiddleware } from '@tanstack/react-start'

import { createCustomLogger } from '@/core/utils'

const CORRELATION_ID_HEADER = 'X-Correlation-Id'

export const loggingMiddleware = createMiddleware().server(async ({ next }) => {
	const corrId = uuidV4()
	const logger = createCustomLogger('http', corrId)

	// Process the call and pass the logger
	const result = await next({ context: { logger } })

	const method = result.request.method
	const functionName = new URL(result.request.url).pathname
	const status = result.response.status
	if (functionName.startsWith('/_serverFn'))
		logger.trace({ method, functionName, status, message: `${method} ${functionName} - ${status}` })
	else
		logger.info({ method, functionName, status, message: `${method} ${functionName} - ${status}` })

	result.response.headers.set(CORRELATION_ID_HEADER, corrId)
	return result
})
