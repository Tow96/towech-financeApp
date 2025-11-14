import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'

import appCss from '@/styles.css?url'

import { getThemeServer } from '@/common/components/ui/theme-provider'
import { CustomClerkProvider, getClerkAuth } from '@/integrations/clerk'

interface RouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async () => {
		const { userId } = await getClerkAuth()
		return { userId }
	},
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ title: 'Towech Finance App' },
			{ description: 'Keep track of your budgets and expenses' },
		],
		links: [{ rel: 'stylesheet', href: appCss }],
	}),
	loader: async () => {
		const theme = await getThemeServer()
		return { theme }
	},
	shellComponent: RootDocument,
})

function RootDocument() {
	const data = Route.useLoaderData()

	return (
		<html className={data.theme} lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<CustomClerkProvider>
					<Outlet />
				</CustomClerkProvider>
				<Scripts />
			</body>
		</html>
	)
}
