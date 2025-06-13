import {ReactNode} from "react";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader} from "@/lib/shadcn-ui/components/ui/sidebar";
import {DashboardButton} from "@/lib/webclient/sidebar/dashboard-button";
import {WebClientNav} from "@/lib/webclient/sidebar/sidebar-nav";
import {UserMenuButton} from "@/lib/users";

export const WebClientSidebar = (): ReactNode => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DashboardButton />
      </SidebarHeader>

      <SidebarContent>
        <WebClientNav />
      </SidebarContent>

      <SidebarFooter>
          <UserMenuButton />
      </SidebarFooter>
    </Sidebar>
  )
}