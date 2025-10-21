import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/lib/shadcn-ui/components/ui/sidebar';
import { Separator } from '@/lib/shadcn-ui/components/ui/separator';
import { UsersProvider } from '@/lib/users';
import { PageTitle, QueryProvider, ThemeProvider, WebClientSidebar } from '@/lib/webclient';

export const metadata: Metadata = {
  title: 'Towechlabs Finance App',
  description: 'Keep track of your budgets and expenses',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const openSidebar = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <html lang="en">
      <body>
        <UsersProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <SidebarProvider defaultOpen={openSidebar}>
                <WebClientSidebar />
                <SidebarInset>
                  {/* Header */}
                  <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                      <SidebarTrigger />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <PageTitle />
                    </div>
                  </header>
                  {/* Content */}
                  <main>{children}</main>
                </SidebarInset>
              </SidebarProvider>
            </ThemeProvider>
          </QueryProvider>
        </UsersProvider>
      </body>
    </html>
  );
}
