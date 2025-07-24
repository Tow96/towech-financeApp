import { ReactNode } from 'react';

import { cn } from '@/lib/shadcn-ui/utils';

import { Features as CategoryFeatures } from '@/lib/categories';
import { MovementDto } from '@/lib/movements/data-store';
import { convertCentsToCurrencyString } from '@/lib/utils';
import { CategoryType } from '@/lib/categories/data-store';
import { MovementItemMenu } from './menu';

interface MovementItemProps {
  movement: MovementDto;
}

const convertIsoDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

export const MovementItem = ({ movement }: MovementItemProps): ReactNode => {
  // const origin = movement.summary[0]?.originWalletId || null;
  // const destination = movement.summary[0]?.destinationWalletId || null;

  return (
    <>
      <div className="flex items-center min-w-0 gap-4 py-4 border-b-1 last:border-b-0">
        <CategoryFeatures.CategoryIcon
          className="rounded-full w-16 h-16"
          type={movement.category.type}
          id={movement.category.id}
          subId={movement.category.subId}
        />
        <div className="flex-1">
          {/* Main data */}
          <div className="flex justify-between text-2xl font-bold">
            <span>
              <CategoryFeatures.CategoryName
                type={movement.category.type}
                id={movement.category.id}
                subId={movement.category.subId}
              />
            </span>
            <span
              className={cn(
                movement.category.type === CategoryType.income && 'text-constructive',
                movement.category.type == CategoryType.expense && 'text-destructive'
              )}>
              {convertCentsToCurrencyString(movement.summary[0]?.amount || 0)}
            </span>
          </div>
          {/* Secondary data */}
          <div className="flex justify-between text-muted-foreground">
            <span>{movement.description}</span>
            <span>{convertIsoDate(movement.date)}</span>
          </div>
        </div>
        <MovementItemMenu movement={movement} />
      </div>
    </>
  );
};
