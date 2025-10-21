'use client';

import { ReactNode } from 'react';
import { SignOutButton, useClerk } from '@clerk/nextjs';
import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';

import { UserBadge } from './user-badge';
import { SidebarMenuButton, useSidebar } from '@/lib/shadcn-ui/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/lib/shadcn-ui/components/ui/dropdown-menu';

export const EnabledUserButton = (): ReactNode => {
  const { isMobile } = useSidebar();
  const clerk = useClerk();

  const user = {
    email: clerk.user?.emailAddresses[0]?.emailAddress ?? '',
    name: clerk.user?.fullName ?? '',
    avatar: clerk.user?.imageUrl ?? '',
  };

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
        <DropdownMenuLabel className="p-0 font-normal px-1 py-1.5">
          <UserBadge name={user.name} email={user.email} avatar={user.avatar} />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Main Menu */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={clerk?.redirectToUserProfile}>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <LogOut />
          <SignOutButton />
          {/*Log out*/}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
