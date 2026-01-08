import { LogOut } from 'lucide-react'
import { redirect } from '@tanstack/react-router'

import { useUserDetail } from '@/ui/data-access'

import { SidebarMenu, SidebarMenuButton, useSidebar } from '@/common/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu'

import { useSignOutMutation } from '@/features/sessions/sign-out'

export const UserMenuButton = () => {
	const mockId = import.meta.env.VITE_MOCK_USER_ID
	const disabledUsers = mockId !== undefined && mockId.trim() !== ''

	return (
		<SidebarMenu>
			<SidebarMenu>{disabledUsers ? <DisabledUserButton /> : <EnabledUserButton />}</SidebarMenu>
		</SidebarMenu>
	)
}

const DisabledUserButton = () => (
	<SidebarMenuButton>
		<UserBadge name="Test Account" avatar="" />
	</SidebarMenuButton>
)

const EnabledUserButton = () => {
	const { isMobile } = useSidebar()
	const user = useUserDetail()
	const signOut = useSignOutMutation()

	const onSignOutClick = () => {
		signOut.mutate(undefined, {
			onSuccess: () => redirect({ to: '/', throw: true }),
		})
	}

	return (
		<DropdownMenu>
			{/* Button */}
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
					<UserBadge name={user.data?.name ?? ''} avatar={user.data?.avatarUrl ?? ''} />
				</SidebarMenuButton>
			</DropdownMenuTrigger>

			{/*	Dropdown content */}
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				side={isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}>
				{/* User data	*/}
				<DropdownMenuLabel className="p-0 px-1 py-1.5 font-normal">
					<DropdownMenuItem onClick={onSignOutClick}>
						<LogOut />
						<span>Sign out</span>
					</DropdownMenuItem>
				</DropdownMenuLabel>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

interface UserBadgeProps {
	name: string
	avatar: string
}

export const UserBadge = (props: UserBadgeProps) => {
	const fallbackName = 'CN'

	return (
		<div className="flex items-center gap-2 text-left text-sm">
			<Avatar className="h-6 w-6 rounded-full">
				<AvatarImage src={props.avatar} alt={props.name} />
				<AvatarFallback className="rounded-lg">{fallbackName}</AvatarFallback>
			</Avatar>
			<div className="flex flex-1 flex-col text-left leading-tight">
				<span className="truncate font-medium">{props.name}</span>
			</div>
		</div>
	)
}
