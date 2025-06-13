import { ReactNode } from 'react';
import { SidebarMenuButton } from '@financeapp/shadcn-ui';
import { UserBadge } from './user-badge';

export const DisabledUserButton = (): ReactNode => (
  <SidebarMenuButton>
    <UserBadge name="Test Account" email="test.account@provider.com" avatar="" />
  </SidebarMenuButton>
);
