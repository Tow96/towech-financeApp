import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
	useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { createServerFn } from '@tanstack/react-start'

import type { ReactNode } from 'react'
import type { QueryClient } from '@tanstack/react-query'

import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import appCss from '@/styles.css?url'

import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	getSidebarState,
} from '@/common/components/ui/sidebar'
import { AppSidebar } from '@/common/components/app-sidebar'
import { Separator } from '@/common/components/ui/separator'
import { capitalizeFirst } from '@/common/lib/utils.ts'

import { getThemeServer } from '@/common/components/ui/theme-provider.tsx'
import { CustomClerkProvider, getClerkAuth } from '@/integrations/clerk'

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
		const sidebarInitialState = await getSidebarState()

		return {
			theme,
			sidebarInitialState,
		}
	},
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
	const data = Route.useLoaderData()

	return (
		<html className={data.theme} lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<CustomClerkProvider>
					<SidebarProvider defaultOpen={data.sidebarInitialState}>
						<AppSidebar />
						<SidebarInset>
							{/*	Header */}
							<header className="flex h-16 shrink-0 items-center gap-2 border-b">
								<div className="flex items-center gap-2 px-3">
									<SidebarTrigger />
									<Separator orientation="vertical" className="mr-2 h-4" />
									<PageTitle />
								</div>
							</header>

							{/*	Content */}
							<main>
								{children}
								<TanStackDevtools
									config={{ position: 'bottom-right' }}
									plugins={[
										{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
										TanStackQueryDevtools,
									]}
								/>
							</main>
						</SidebarInset>
					</SidebarProvider>
				</CustomClerkProvider>
				<Scripts />
			</body>
		</html>
	)
}

const PageTitle = (): ReactNode => {
	const location = useLocation()

	return (
		<h1 className="text-lg font-bold">
			{capitalizeFirst(location.pathname.slice(1).split('/')[0])}
		</h1>
	)
}
