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

const convertIsoDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export const MovementItem = ({ movement }: MovementItemProps): ReactNode => {
  // const origin = movement.summary[0]?.originWalletId || null;
  // const destination = movement.summary[0]?.destinationWalletId || null;

  // const type: CategoryType =
  //   origin !== null && destination !== null
  //     ? CategoryType.transfer
  //     : origin === null && destination !== null
  //       ? CategoryType.income
  //       : CategoryType.expense;

  return (
    <>
      <div className="flex items-center min-w-0 gap-4 py-4 border-b-1 last:border-b-0">
        aaaa
        {/*<CategoryFeatures.CategoryIcon*/}
        {/*  className="rounded-full w-16 h-16"*/}
        {/*  id={movement.categoryId}*/}
        {/*/>*/}

        {/*<div className="flex-1">*/}
        {/*  /!* Main data *!/*/}
        {/*  <div className="flex justify-between text-2xl font-bold">*/}
        {/*    <span>*/}
        {/*      <CategoryFeatures.CategoryName id={movement.categoryId} />*/}
        {/*    </span>*/}
        {/*    <span*/}
        {/*      className={cn(*/}
        {/*        type === CategoryType.income && 'text-constructive',*/}
        {/*        type == CategoryType.expense && 'text-destructive'*/}
        {/*      )}>*/}
        {/*      {convertCentsToCurrencyString(movement.summary[0]?.amount || 0)}*/}
        {/*    </span>*/}
        {/*  </div>*/}

        {/*  /!* Secondary data *!/*/}
        {/*  <div className="flex justify-between text-muted-foreground">*/}
        {/*    <span>{movement.description}</span>*/}
        {/*    <span>{convertIsoDate(movement.date)}</span>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<MovementItemMenu movement={movement} />*/}
      </div>
    </>
  );
};
