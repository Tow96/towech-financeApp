'use client';
import { ComponentProps, ReactNode, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>): ReactNode {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>
// }

export function ThemeProvider({ children, ...props}: ComponentProps<typeof NextThemesProvider>): ReactNode {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, [])

  if (!isLoaded) return null;

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
