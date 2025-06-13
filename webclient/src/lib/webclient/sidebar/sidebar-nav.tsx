import {SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/lib/shadcn-ui/components/ui/sidebar";
import {CircleDot} from "lucide-react";

const pages = [
  {
    name: 'Categories',
    url: '/categories',
    icon: CircleDot,
  },
];

export const WebClientNav = () => {
  return (
    <SidebarGroup>
      {/*<SidebarGroupLabel>TODO</SidebarGroupLabel>*/}
      <SidebarMenu>
        {pages.map((page) => (
          <SidebarMenuItem key={page.name}>
            <SidebarMenuButton asChild tooltip={page.name}>
              <a href={page.url}>
                {page.icon && <page.icon />}
                <span>{page.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};