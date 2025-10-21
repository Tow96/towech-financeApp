import { Link } from '@tanstack/react-router'

import { ChartNoAxesCombined, CircleDot, FileChartColumn, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/common/components/ui/sidebar.tsx'

const pages = [
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
	{
		name: 'Budgets',
		url: '/budgets',
		icon: FileChartColumn,
	},
	{
		name: 'Statistics',
		url: '/stats',
		icon: ChartNoAxesCombined,
	},
]

export const AppNav = (): ReactNode => {
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
