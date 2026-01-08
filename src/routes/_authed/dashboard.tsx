import { createFileRoute } from '@tanstack/react-router'

import { DashboardPage } from '@/ui/pages'

export const Route = createFileRoute('/_authed/dashboard')({
	component: DashboardPage,
})
