// Override of the server entry point, so the pino polyfill can be added
import handler from '@tanstack/react-start/server-entry'
import '@/integrations/pino/logging-polyfill'

export default {
	fetch(request: Request) {
		return handler.fetch(request)
	},
}
