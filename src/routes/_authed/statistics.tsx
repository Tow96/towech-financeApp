import { createFileRoute } from '@tanstack/react-router'

import { StatisticsPage } from '@/ui/pages'

export const Route = createFileRoute('/_authed/statistics')({
	component: StatisticsPage,
})

