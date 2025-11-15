import { useClerk } from '@clerk/shared/react'
import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react'

import type { ReactNode } from 'react'

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/common/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu'

export const UserMenuButton = (): ReactNode => {
	const mockId = import.meta.env.VITE_MOCK_USER_ID
	const disabledUsers = mockId !== undefined && mockId.trim() !== ''

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

const EnabledUserButton = (): ReactNode => {
	const { isMobile } = useSidebar()
	const clerk = useClerk()

	const user = {
		email: clerk.user?.emailAddresses[0]?.emailAddress ?? '',
		name: clerk.user?.fullName ?? '',
		avatar: clerk.user?.imageUrl ?? '',
	}

	return (
		<DropdownMenu>
			{/* Button */}
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					<UserBadge name={user.name} email={user.email} avatar={user.avatar} />
					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>

			{/* Dropdown content */}
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				side={isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}>
				{/* User data */}
				<DropdownMenuLabel className="p-0 px-1 py-1.5 font-normal">
					<UserBadge name={user.name} email={user.email} avatar={user.avatar} />
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Main Menu */}
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={clerk.redirectToUserProfile}>
						<BadgeCheck />
						Account
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Log out */}
				<DropdownMenuItem onClick={() => clerk.signOut({ redirectUrl: '/' })}>
					<LogOut />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

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
