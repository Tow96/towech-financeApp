import { createFileRoute } from '@tanstack/react-router'

import { googleLoginCallback } from '@/ui/api'

export const Route = createFileRoute('/login/google/callback')({
	server: {
		handlers: {
			GET: async ({ request, context: { logger } }) => googleLoginCallback(request, logger),
		},
	},
})
