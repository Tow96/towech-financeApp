import { ReactNode } from 'react';
import {SidebarMenu, SidebarMenuItem} from "@/lib/shadcn-ui/components/ui/sidebar";
import { EnabledUserButton } from './enabled-user-button';
import { DisabledUserButton } from './disabled-user-button';

export const UserMenuButton = (): ReactNode => {
  const disabledUsers = process.env.NEXT_USERS_DISABLED === 'true';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {disabledUsers ? <DisabledUserButton /> : <EnabledUserButton />}{' '}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
