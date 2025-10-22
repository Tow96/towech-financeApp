import createLogger from 'pino'
import type { TransportSingleOptions } from 'pino'

const PrettyTransport: TransportSingleOptions = {
	target: 'pino-pretty',
	options: {
		colorize: true,
		messageKey: 'message',
		ignore: 'pid,hostname,context',
		messageFormat: '<id:{correlationId}> [{context}] {message}',
	},
}

const env = process.env.NODE_ENV || 'production'
const logLevel = process.env.LOG_LEVEL || 'info'

export const createCustomLogger = (name: string, correlationId?: string) => {
	const logger = createLogger({
		transport: env === 'development' ? PrettyTransport : undefined,
		level: logLevel,
		messageKey: 'message',
	})

	return logger.child({ name, correlationId })
}
