import { ReactNode } from 'react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@financeapp/shadcn-ui';
import { DashboardButton } from './app-sidebar-header';
import { AppSidebarNav } from './app-sidebar-nav';

export const AppSidebar = (): ReactNode => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DashboardButton />
      </SidebarHeader>

      <SidebarContent>
        <AppSidebarNav />
      </SidebarContent>

      <SidebarFooter>TODO: USER BUTTON</SidebarFooter>
    </Sidebar>
  );
};
