import { ReactNode } from 'react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@financeapp/shadcn-ui';
import { DashboardButton } from './dashboard-button';
import { AppSidebarNav } from './app-sidebar-nav';
import { UserMenuButton } from '@financeapp/users-frontend';

export const AppSidebar = (): ReactNode => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DashboardButton />
      </SidebarHeader>

      <SidebarContent>
        <AppSidebarNav />
      </SidebarContent>

      <SidebarFooter>
        <UserMenuButton />
      </SidebarFooter>
    </Sidebar>
  );
};
