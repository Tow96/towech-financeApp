import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'

const searchParamsSchema = z.object({
	unregistered: z.boolean().default(false),
})

export const Route = createFileRoute('/login/')({
	validateSearch: searchParamsSchema,
	component: RouteComponent,
})

function RouteComponent() {
	const { unregistered } = Route.useSearch()

	return (
		<>
			<h1>Sign in</h1>
			{unregistered && (
				<div>This google account is not registered in the app. Try with another</div>
			)}
			<a href="/login/google">Sign in with Google</a>
		</>
	)
}
