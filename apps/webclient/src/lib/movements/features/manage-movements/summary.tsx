import { ReactNode } from 'react';
import { MovementDto } from '@/lib/movements/data-store';
import { CategoryType } from '@/lib/categories/data-store';
import { convertCentsToCurrencyString } from '@/lib/utils';

interface MonthSummaryProps {
  movements: MovementDto[];
}

export const MonthSummary = (props: MonthSummaryProps): ReactNode => {
  const inMoney = props.movements
    .filter(m => m.category.type === CategoryType.income)
    .map(m => m.summary[0].amount)
    .reduce((prev, curr) => prev + curr, 0);
  const outMoney = props.movements
    .filter(m => m.category.type === CategoryType.expense)
    .map(m => m.summary[0].amount)
    .reduce((prev, curr) => prev + curr, 0);

  return (
    <div className="text-3xl">
      <div className="flex justify-between">
        <span>In:</span>
        <span className="text-constructive">{convertCentsToCurrencyString(inMoney)}</span>
      </div>
      <div className="flex justify-between">
        <span>Out:</span>
        <span className="text-destructive border-b-2 border-primary">
          {convertCentsToCurrencyString(outMoney)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Total:</span>
        <span>{convertCentsToCurrencyString(inMoney - outMoney)}</span>
      </div>
    </div>
  );
};
