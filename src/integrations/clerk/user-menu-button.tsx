import type { ReactNode } from 'react'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/common/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar'

export const UserMenuButton = (): ReactNode => {
	const disabledUsers = import.meta.env.VITE_USERS_DISABLED === 'true'

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				{disabledUsers ? <DisabledUserButton /> : <EnabledUserButton />}
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

const DisabledUserButton = (): ReactNode => (
	<SidebarMenuButton>
		<UserBadge name="Test Account" email="test.account@provider.com" avatar="" />
	</SidebarMenuButton>
)

const EnabledUserButton = (): ReactNode => <SidebarMenuButton>TODO: Clerk</SidebarMenuButton>

interface UserBadgeProps {
	name: string
	email: string
	avatar: string
}

export const UserBadge = (props: UserBadgeProps): ReactNode => {
	const fallbackName = 'CN'

	return (
		<div className="flex items-center gap-2 text-left text-sm">
			<Avatar className="h-6 w-6 rounded-full">
				<AvatarImage src={props.avatar} alt={props.name} />
				<AvatarFallback className="rounded-lg">{fallbackName}</AvatarFallback>
			</Avatar>
			<div className="flex flex-1 flex-col text-left text-sm leading-tight">
				<span className="truncate font-medium">{props.name}</span>
				<span className="truncate text-xs">{props.email}</span>
			</div>
		</div>
	)
}
