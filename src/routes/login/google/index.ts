import { createFileRoute } from '@tanstack/react-router'

import { googleLogin } from '@/ui/api'

export const Route = createFileRoute('/login/google/')({
	server: { handlers: { GET: googleLogin } },
})
