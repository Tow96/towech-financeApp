import { ReactNode } from 'react';

import { cn } from '@/lib/shadcn-ui/utils';
import { Skeleton } from '@/lib/shadcn-ui/components/ui/skeleton';

import { Features as CategoryFeatures } from '@/lib/categories';
import { MovementDto } from '@/lib/movements/data-store';
import { convertNumToCurrencyString } from '@/lib/utils';

interface MovementItemProps {
  movement: MovementDto;
}

const convertIsoDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export const MovementItem = ({ movement }: MovementItemProps): ReactNode => {
  return (
    <>
      <div className="flex items-center min-w-0 gap-4 py-4 border-b-1 last:border-b-0">
        <CategoryFeatures.CategoryIcon
          className="rounded-full w-16 h-16"
          id={movement.categoryId}
        />

        <div className="flex-1">
          {/* Main data */}
          <div className="flex justify-between text-2xl font-bold">
            <span>
              <CategoryFeatures.CategoryName id={movement.categoryId} />
            </span>
            <span>{convertNumToCurrencyString(0)}</span>
          </div>

          {/* Secondary data */}
          <div className="flex justify-between text-muted-foreground">
            <span>{movement.description}</span>
            <span>{convertIsoDate(movement.date)}</span>
          </div>
        </div>
      </div>
    </>
  );
};
