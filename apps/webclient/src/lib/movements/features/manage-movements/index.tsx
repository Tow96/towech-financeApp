'use client';
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';
import { useMovements } from '@/lib/movements/data-store';

import { AddMovementDialog } from './add-movement-dialog';
import { MovementList } from '@/lib/movements/features/manage-movements/movement-list';

export const ManageMovementsView = (): ReactNode => {
  const movements = useMovements();

  return (
    <Card className="m-4">
      <CardHeader className="flex items-center justify-end">
        <AddMovementDialog />
      </CardHeader>
      <CardContent>
        <MovementList movements={movements.data || []} loading={movements.isLoading} />
      </CardContent>
    </Card>
  );
};
