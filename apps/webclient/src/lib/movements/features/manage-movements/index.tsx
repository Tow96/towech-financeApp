'use client';
import { ReactNode } from 'react';
import { Card, CardHeader } from '@/lib/shadcn-ui/components/ui/card';
import { useMovements } from '@/lib/movements/data-store';

import { AddMovementDialog } from './add-movement-dialog';

export const ManageMovementsView = (): ReactNode => {
  const movements = useMovements();

  return (
    <Card className="m-4">
      <CardHeader className="flex items-center justify-end">
        <AddMovementDialog />
      </CardHeader>

      {JSON.stringify(movements.data)}
    </Card>
  );
};
