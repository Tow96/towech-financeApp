'use client';

import { CircleDot } from 'lucide-react';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@financeapp/shadcn-ui';

const pages = [
  {
    name: 'Categories',
    url: '/categories',
    icon: CircleDot,
  },
];

export const AppSidebarNav = () => {
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
