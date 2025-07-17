import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/lib/shadcn-ui/components/ui/sidebar';
import { CircleDot, Wallet } from 'lucide-react';

const pages = [
  {
    name: 'Wallets',
    url: '/wallets',
    icon: Wallet,
  },
  {
    name: 'Categories',
    url: '/categories',
    icon: CircleDot,
  },
];

export const WebClientNav = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Components</SidebarGroupLabel>
      <SidebarMenu>
        {pages.map(page => (
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
