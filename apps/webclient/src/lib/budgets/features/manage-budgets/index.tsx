'use client';
import { ReactNode, useState } from 'react';

import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';
import { useBudgets } from '@/lib/budgets/data-store';

export const ManageBudgetsView = (): ReactNode => {
  const budgets = useBudgets();

  return (
    <Card className="m-4">
      <CardHeader className="flex items-center justify-between">
        <span>year select</span>
        <Button>Add budget</Button>
      </CardHeader>
      <CardContent>{JSON.stringify(budgets.data)}</CardContent>
    </Card>
  );
};
