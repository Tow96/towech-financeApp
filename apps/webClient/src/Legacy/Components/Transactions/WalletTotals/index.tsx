/** Index.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * Component that shows the sum of income and expense of the transactions
 */
// Utils
import ParseMoneyAmount from '../../../Utils/ParseMoneyAmount';

// Styles
import './WalletTotals.css';
import { ReactElement } from 'react';

interface Props {
  totals: { earnings: number; expenses: number };
  hidden?: boolean;
}

const WalletTotals = (props: Props): ReactElement => {
  return (
    <div className={props.hidden ? 'Transactions__Totals inactive' : 'Transactions__Totals'}>
      <div className="Transactions__Totals__Items">
        <div>In: </div>
        <div>Out: </div>
        <div>Total: </div>
      </div>
      <div className="Transactions__Totals__Numbers">
        <div className="Transactions__Totals__Numbers__In">
          {' '}
          + {ParseMoneyAmount(props.totals.earnings)}
        </div>
        <div className="Transactions__Totals__Numbers__Out">
          {' '}
          - {ParseMoneyAmount(props.totals.expenses)}{' '}
        </div>
        <div> {ParseMoneyAmount(props.totals.earnings - props.totals.expenses)}</div>
      </div>
    </div>
  );
};

export default WalletTotals;
