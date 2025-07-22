'use client';
import { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';
import { MovementDto, useMovements } from '@/lib/movements/data-store';

import { AddMovementDialog } from './add-movement-dialog';
import { MovementList } from '@/lib/movements/features/manage-movements/movement-list';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shadcn-ui/components/ui/popover';
import { FormControl } from '@/lib/shadcn-ui/components/ui/form';
import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { cn } from '@/lib/shadcn-ui/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/lib/shadcn-ui/components/ui/calendar';
import { WalletFilter } from '@/lib/wallets/features/filter-wallet';

export const ManageMovementsView = (): ReactNode => {
  const [date, setDate] = useState(new Date());
  const [filteredWallet, setFilteredWallet] = useState<string | null>(null);

  const movements = useMovements(date.getFullYear(), date.getMonth() + 1);
  const filteredMovements = (movements.data || ([] as MovementDto[])).filter(m => {
    if (filteredWallet === null) return true;

    return (
      m.summary[0]?.originWalletId === filteredWallet ||
      m.summary[0]?.destinationWalletId === filteredWallet
    );
  });

  return (
    <Card className="m-4">
      <CardHeader className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {`${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} captionLayout="dropdown" />
          </PopoverContent>
        </Popover>
        <WalletFilter selectedWallet={filteredWallet} setSelectedWallet={setFilteredWallet} />
        <AddMovementDialog />
      </CardHeader>
      <CardContent>
        <MovementList movements={filteredMovements} loading={movements.isLoading} />
      </CardContent>
    </Card>
  );
};
