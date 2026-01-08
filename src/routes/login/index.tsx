import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoginPage } from '@/ui/pages'

const searchParamsSchema = z.object({
	unregistered: z.boolean().default(false),
})

export const Route = createFileRoute('/login/')({
	beforeLoad: ({ context }) => {
		if (context.userId !== undefined) redirect({ to: '/', throw: true })
	},
	validateSearch: searchParamsSchema,
	component: RouteComponent,
})

function RouteComponent() {
	const { unregistered } = Route.useSearch()

	return <LoginPage unregistered={unregistered} />
}
