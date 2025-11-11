import { Link } from '@tanstack/react-router'

import { CircleDot, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/common/components/ui/sidebar'

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
