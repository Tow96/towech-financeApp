import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { getUserId } from '@/features/users/get-id'

import appCss from '@/styles.css?url'
import { getThemeServer } from '@/common/components/ui/theme-provider'

interface RouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async () => {
		try {
			const userId = await getUserId()
			return { userId }
		} catch (_) {
			return { userId: undefined }
		}
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
				<Outlet />
				<Scripts />
			</body>
		</html>
	)
}
