import { CircleDot, Layers2, Receipt, Wallet } from 'lucide-react'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

import { Link, Outlet, createFileRoute, redirect, useLocation } from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import {
	Separator,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	ThemeSelector,
	UserMenuButton,
	getSidebarState,
} from '@/ui/components'
import { capitalizeFirst, cn } from '@/ui/utils'

export const Route = createFileRoute('/_authed')({
	beforeLoad: ({ context }) => {
		if (!context.userId) redirect({ to: '/login', throw: true })
	},
	loader: async () => {
		const sidebarInitialState = await getSidebarState()
		return { sidebarInitialState }
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
					<div className="flex w-full items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<PageTitle className="flex-1" />
						<ThemeSelector />
					</div>
				</header>

				{/*	Content */}
				<main>
					<Outlet />
					{import.meta.env.VITE_ENABLE_DEVTOOLS === 'true' && (
						<TanStackDevtools
							config={{ position: 'bottom-right' }}
							plugins={[
								{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
								{ name: 'Tanstack Query', render: <ReactQueryDevtoolsPanel /> },
							]}
						/>
					)}
				</main>
			</SidebarInset>
		</SidebarProvider>
	)
}

type PageTitleProps = {
	className?: string
}
const PageTitle = (props: PageTitleProps) => {
	const location = useLocation()

	return (
		<h1 className={cn(props.className, 'text-lg font-bold')}>
			{capitalizeFirst(location.pathname.slice(1).split('/')[0])}
		</h1>
	)
}

const AppSidebar = () => {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<DashboardButton />
			</SidebarHeader>

			<SidebarContent>
				<AppNav />
			</SidebarContent>

			<SidebarFooter>
				<UserMenuButton />
			</SidebarFooter>
		</Sidebar>
	)
}

const DashboardButton = () => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" asChild>
					<Link to="/dashboard">
						<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
							<Layers2 className="size-4" />
						</div>
						<div className="flex flex-col gap-0.5 leading-none">
							<span className="text-lg">Dashboard</span>
						</div>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

const pages = [
	{
		name: 'Movements',
		url: '/movements',
		icon: Receipt,
	},
	{
		name: 'Wallets',
		url: '/wallets',
		icon: Wallet,
	},
	{
		name: 'Categories',
		url: '/categories',
		icon: CircleDot,
	},
]

const AppNav = () => {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Components</SidebarGroupLabel>
			<SidebarMenu>
				{pages.map(page => (
					<SidebarMenuItem key={page.name}>
						<SidebarMenuButton asChild tooltip={page.name}>
							<Link to={page.url}>
								{<page.icon />}
								<span>{page.name}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
