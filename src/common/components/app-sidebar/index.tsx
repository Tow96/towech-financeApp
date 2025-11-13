import { DashboardButton } from './dashboard-button'
import { AppNav } from './nav'

import type { ReactNode } from 'react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/common/components/ui/sidebar'
import { UserMenuButton } from '@/integrations/clerk'

export const AppSidebar = (): ReactNode => {
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
