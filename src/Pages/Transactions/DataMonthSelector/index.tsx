/** DataMonthSelector.tsx
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 * Component that handles the selection of months to display
 */
// Libraries
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GetParameters from '../../../Utils/GetParameters';

// Hooks
import { TransactionPageStore } from '../../../Hooks/ContextStore';

// Styles
import './DataMonthSelector.css';

// Components
import Button from '../../../Components/Button';

const addMonths = (dataMonth: string, amount: number): string => {
  let year = parseInt(dataMonth.substring(0, 4));
  let month = parseInt(dataMonth.substring(4, 6));

  // adds the month
  month += amount;

  // if the month is smaller than 1, the substracts years until finished
  while (month < 1) {
    year--;
    month += 12;
  }

  // if the month is bigger than 12 it adds years until finished
  while (month > 12) {
    year++;
    month -= 12;
  }

  return `${year}${month.toString().padStart(2, '0')}`;
};

const displayDataMonth = (dataMonth: string): string => {
  return `${dataMonth.substring(0, 4)}/${dataMonth.substring(4, 6)}`;
};

const isCurrentMonth = (selectedDataMonth: string): boolean => {
  const currDataMonth = `${new Date().getFullYear()}${('0' + (new Date().getMonth() + 1)).slice(-2)}`;

  return currDataMonth !== selectedDataMonth;
};

const DataMonthSelector = (): JSX.Element => {
  const { transactionState, dispatchTransactionState } = useContext(TransactionPageStore);

  // Roter
  const navigate = useNavigate();
  const location = useLocation();

  // Hooks for the selection buttons
  const [prevMonth, setPrevMonth] = useState(addMonths(transactionState.dataMonth, -1));
  const [nextMonth, setNextMonth] = useState(addMonths(transactionState.dataMonth, 1));

  //
  const setCurrentMonth = (amount: number): void => {
    // sets the buttons month to change
    setNextMonth(addMonths(nextMonth, amount));
    dispatchTransactionState({
      type: 'SELECT-DATAMONTH',
      payload: { dataMonth: addMonths(transactionState.dataMonth, amount) },
    });
    setPrevMonth(addMonths(prevMonth, amount));

    // redirects to the new datamonth
    const walletId = GetParameters(location.search, 'wallet') || '-1';
    navigate(`/home?wallet=${walletId}&month=${addMonths(transactionState.dataMonth, amount)}`);
  };

  const goToToday = (): void => {
    const currentDataMonth = `${new Date().getFullYear()}${('0' + (new Date().getMonth() + 1)).slice(-2)}`;

    // sets the buttons state
    setNextMonth(addMonths(currentDataMonth, 1));
    dispatchTransactionState({
      type: 'SELECT-DATAMONTH',
      payload: { dataMonth: currentDataMonth },
    });
    setPrevMonth(addMonths(currentDataMonth, -1));

    // redirects to the current datamonth
    const walletId = GetParameters(location.search, 'wallet') || '-1';
    navigate(`/home?wallet=${walletId}&month=${currentDataMonth}`);
  };

  return (
    <div className="Transactions__MonthSelector">
      <div className="Transactions__MonthSelector__Top">
        <Button className="Transactions__MonthSelector__Button" onClick={() => setCurrentMonth(-1)}>
          {displayDataMonth(prevMonth)}
        </Button>
        <Button className="Transactions__MonthSelector__Button selected">
          {displayDataMonth(transactionState.dataMonth)}
        </Button>
        <Button className="Transactions__MonthSelector__Button" onClick={() => setCurrentMonth(1)}>
          {displayDataMonth(nextMonth)}
        </Button>
      </div>
      {/* Go to current month button, only visible when in a different month */}
      <Button
        accent
        className={
          isCurrentMonth(transactionState.dataMonth)
            ? 'Transactions__MonthSelector__GoTo active'
            : 'Transactions__MonthSelector__GoTo'
        }
        onClick={() => goToToday()}
      >
        Go to current month
      </Button>
    </div>
  );
};

export default DataMonthSelector;
