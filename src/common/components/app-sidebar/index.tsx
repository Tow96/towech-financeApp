import { DashboardButton } from './dashboard-button'
import { AppNav } from './nav'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/common/components/ui/sidebar'

import { UserMenuButton } from '@/features/users/display/client'

export const AppSidebar = () => {
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
