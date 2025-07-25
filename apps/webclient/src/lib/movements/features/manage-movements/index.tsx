'use client';
import { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';
import { MovementDto, useMovements } from '@/lib/movements/data-store';

import { AddMovementDialog } from './add-movement-dialog';
import { MovementList } from '@/lib/movements/features/manage-movements/movement-list';
import { WalletFilter } from '@/lib/wallets/features/filter-wallet';
import { DatePicker } from '@/lib/webclient/datepicker';
import { MonthSummary } from '@/lib/movements/features/manage-movements/summary';

export const ManageMovementsView = (): ReactNode => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filteredWallet, setFilteredWallet] = useState<string>('total');

  const movements = useMovements(
    (date || new Date()).getFullYear(),
    (date || new Date()).getMonth() + 1
  );
  const filteredMovements = (movements.data || ([] as MovementDto[])).filter(m => {
    if (filteredWallet === 'total') return true;

    return (
      m.summary[0]?.wallet.originId === filteredWallet ||
      m.summary[0]?.wallet.destinationId === filteredWallet
    );
  });

  return (
    <Card className="m-4">
      <CardHeader className="flex items-center justify-between">
        <DatePicker value={date} onChange={setDate} />
        <WalletFilter selectedWallet={filteredWallet} setSelectedWallet={setFilteredWallet} />
        <AddMovementDialog />
      </CardHeader>
      <CardContent>
        <MonthSummary movements={filteredMovements} />
        <MovementList movements={filteredMovements} loading={movements.isLoading} />
      </CardContent>
    </Card>
  );
};
