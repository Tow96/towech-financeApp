import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { getUserId } from '@/core/functions'

import appCss from '@/styles.css?url'
import { ThemeProvider } from '@/features/theme'

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
			{ name: 'apple-mobile-web-app-title', content: 'FInance App' },
		],
		links: [
			{ rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
			{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
			{ rel: 'shortcut icon', href: '/favicon.ico' },
			{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
			{ rel: 'manifest', href: '/site.webmanifest' },
			{ rel: 'stylesheet', href: appCss },
		],
	}),
	shellComponent: RootDocument,
})

function RootDocument() {
	return (
		// Hydration warning is suppressed because the theme class on the html element
		// according to react documentation this flag only affects one level deep, so the warning will
		// show up for the rest of the application
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<Outlet />
					<Scripts />
				</ThemeProvider>
			</body>
		</html>
	)
}
