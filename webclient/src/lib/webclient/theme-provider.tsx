'use client';
import { ComponentProps, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>): ReactNode {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
