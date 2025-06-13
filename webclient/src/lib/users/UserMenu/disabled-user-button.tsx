import { ReactNode } from 'react';
import { SidebarMenuButton } from "@/lib/shadcn-ui/components/ui/sidebar";
import { UserBadge } from './user-badge';

export const DisabledUserButton = (): ReactNode => (
  <SidebarMenuButton>
    <UserBadge name="Test Account" email="test.account@provider.com" avatar="" />
  </SidebarMenuButton>
);
