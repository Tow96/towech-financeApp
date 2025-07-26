'use client';
import { ReactNode, useState } from 'react';

import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';
import { ReportDto, useBudgets, useReport } from '@/lib/budgets/data-store';
import { AddBudgetDialog } from './add-budget-dialog';
import { Input } from '@/lib/shadcn-ui/components/ui/input';
import { CategoryType } from '@/lib/categories/data-store';
import { CategoryIcon, CategoryName } from '@/lib/categories/features';
import { convertCentsToCurrencyString } from '@/lib/utils';

interface ReportBucket {
  category: {
    type: CategoryType;
    id: string | null;
    subId: string | null;
  };
  total: number;
}

export const ManageBudgetsView = (): ReactNode => {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const budgets = useBudgets();
  const report = useReport(selectedYear);

  const selectedBudget = budgets.data?.find(b => b.year.toString() === selectedYear);
  const incomeSummary =
    selectedBudget?.summary.filter(s => s.category.type === CategoryType.income) || [];
  const expenseSummary =
    selectedBudget?.summary.filter(s => s.category.type === CategoryType.expense) || [];

  // TODO: There has to be a more efficient system for this
  const buckets: ReportBucket[] =
    selectedBudget?.summary.map(c => ({ category: c.category, total: 0 })) || [];
  if (report.data) {
    for (let i = 0; i < (report.data?.length || 0); i++) {
      const item = report.data[i];

      let bucketIndex = buckets.findIndex(
        b =>
          b.category.type === item.category.type &&
          b.category.id === item.category.id &&
          b.category.subId === item.category.subId
      );
      if (bucketIndex === -1)
        bucketIndex = buckets.findIndex(
          b =>
            b.category.type === item.category.type &&
            b.category.id === item.category.id &&
            b.category.subId === null
        );
      if (bucketIndex === -1)
        bucketIndex = buckets.findIndex(
          b =>
            b.category.type === item.category.type &&
            b.category.id === null &&
            b.category.subId === null
        );
      if (bucketIndex !== -1) buckets[bucketIndex].total += item.amount;
    }
  }

  return (
    <Card className="m-4">
      <CardHeader className="flex items-center justify-between">
        <Input value={selectedYear} onChange={e => setSelectedYear(e.target.value)} type="number" />
        <AddBudgetDialog />
      </CardHeader>
      <CardContent>
        <div>{selectedBudget?.name}</div>
        <div>Income:</div>
        {incomeSummary.map((i, index) => (
          <div key={index} className="flex justify-right">
            <div className="flex w-40">
              <CategoryIcon type={i.category.type} id={i.category.id} subId={i.category.subId} />
              <CategoryName type={i.category.type} id={i.category.id} subId={i.category.subId} />
            </div>
            <div className="flex">
              <span>
                {convertCentsToCurrencyString(
                  buckets.find(
                    b =>
                      b.category.type === i.category.type &&
                      b.category.id === i.category.id &&
                      b.category.subId === i.category.subId
                  )?.total || 0
                )}
              </span>
              <span>/</span>
              <span>{convertCentsToCurrencyString(i.limit)}</span>
            </div>
          </div>
        ))}
        <div>Expense:</div>
        {expenseSummary.map((i, index) => (
          <div key={index} className="flex justify-right">
            <div className="flex w-40">
              <CategoryIcon type={i.category.type} id={i.category.id} subId={i.category.subId} />
              <CategoryName type={i.category.type} id={i.category.id} subId={i.category.subId} />
            </div>
            <div className="flex">
              <span>
                {convertCentsToCurrencyString(
                  buckets.find(
                    b =>
                      b.category.type === i.category.type &&
                      b.category.id === i.category.id &&
                      b.category.subId === i.category.subId
                  )?.total || 0
                )}
              </span>
              <span>/</span>
              <span>{convertCentsToCurrencyString(i.limit)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
