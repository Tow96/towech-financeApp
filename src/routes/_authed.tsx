import { SignIn } from '@clerk/tanstack-react-start'
import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import type { ReactNode } from 'react'

import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	getSidebarState,
} from '@/common/components/ui/sidebar.tsx'
import { Separator } from '@/common/components/ui/separator.tsx'
import { AppSidebar } from '@/common/components/app-sidebar'
import { capitalizeFirst } from '@/common/lib/utils.ts'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools.tsx'

export const Route = createFileRoute('/_authed')({
	beforeLoad: ({ context }) => {
		if (!context.userId) {
			throw new Error('Not authenticated')
		}
	},
	loader: async () => {
		const sidebarInitialState = await getSidebarState()
		return { sidebarInitialState }
	},
	errorComponent: ({ error }) => {
		if (error.message === 'Not authenticated') {
			return (
				<div className="flex items-center justify-center p-12">
					<SignIn routing="virtual" forceRedirectUrl="/" />
				</div>
			)
		}

		throw error
	},
	component: AuthedComponent,
})

function AuthedComponent() {
	const data = Route.useLoaderData()

	return (
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
					<Outlet />
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
