'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { capitalizeFirst } from '@/lib/utils';

export const PageTitle = (): ReactNode => {
  const pathName = usePathname();
  return <h1 className="text-lg font-bold">{capitalizeFirst(pathName.slice(1).split('/')[0])}</h1>;
};
