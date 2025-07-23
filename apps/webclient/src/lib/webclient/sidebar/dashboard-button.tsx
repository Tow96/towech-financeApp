'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/lib/shadcn-ui/components/ui/sidebar';
import { Layers2 } from 'lucide-react';

export const DashboardButton = (): ReactNode => {
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <button onClick={() => router.push('dashboard')}>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Layers2 className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="text-lg">Dashboard</span>
            </div>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
