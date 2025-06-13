import { ReactNode } from 'react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@financeapp/shadcn-ui';
import { Layers2 } from 'lucide-react';

export const DashboardButton = (): ReactNode => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <a href={'dashboard'}>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              {/*<GalleryVerticalEnd className="size-4" />*/}
              <Layers2 className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="text-lg">Dashboard</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
