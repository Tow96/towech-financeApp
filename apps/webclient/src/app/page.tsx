import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const Index = (): ReactNode => redirect('dashboard');

export default Index;
