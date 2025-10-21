import { ReactNode } from 'react';
import { BalanceChart } from '@/lib/stats';

const StatsPage = (): ReactNode => {
  return (
    <div>
      <BalanceChart />
    </div>
  );
};

export default StatsPage;
