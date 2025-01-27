/** TransactionViewer.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 * Componet that shows all the given transactions
 */
// Libraries
import { useContext } from 'react';

// Models
import { Objects } from '../../models';

// Hooks
import { TransactionPageStore } from '../../Hooks/ContextStore';

// Components
import TransactionCard from './TransactionCard';

interface Props {
  hidden: boolean;
}

const TransactionViewer = (props: Props): JSX.Element => {
  const { transactionState } = useContext(TransactionPageStore);

  return (
    <div className={props.hidden ? 'Transactions__Viewer inactive' : 'Transactions__Viewer'}>
      {transactionState.transactions.length == 0 ? (
        <div className="Transactions__Empty">
          <h1>There are no transactions for this period</h1>
        </div>
      ) : (
        <div className="Transactions__Viewer__List">
          {transactionState.transactions.map((transaction: Objects.Transaction) => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))}
          <div className="Transactions__Viewer__Filler" />
        </div>
      )}
    </div>
  );
};

export default TransactionViewer;
