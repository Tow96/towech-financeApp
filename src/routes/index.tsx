import { createFileRoute, redirect } from '@tanstack/react-router'

// There is no main page, it automatically redirects to the dashboard
export const Route = createFileRoute('/')({
	loader: () => {
		redirect({ to: '/dashboard', throw: true })
	},
})
