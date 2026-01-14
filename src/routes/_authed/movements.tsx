import { createFileRoute } from '@tanstack/react-router'

import { MovementPage } from '@/ui/pages'

export const Route = createFileRoute('/_authed/movements')({
	component: MovementPage,
})

