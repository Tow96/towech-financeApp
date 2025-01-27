/**index.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component that shows the Wallet elements
 */
import { useState } from 'react';

// Hooks
import WalletForm from '../WalletForm';

// Models
import { Objects } from '../../../models';

// Components
import { IdIcons } from '../../../Icons';

// Utils
import ParseMoneyAmount from '../../../Utils/ParseMoneyAmount';

import './WalletCard.css';

interface WalletCardProps {
  wallet: Objects.Wallet;
}

const WalletCard = (props: WalletCardProps): JSX.Element => {
  // Hooks
  const [showEdit, setEdit] = useState(false);

  return (
    <>
      <div className="WalletCard" onClick={() => setEdit(true)}>
        <div className="WalletCard__Main">
          <IdIcons.Variable iconid={props.wallet.icon_id} className="WalletCard__Icon" />
          <div className="WalletCard__Info">
            <div className="WalletCard__Info__Name">{props.wallet.name}</div>
            <div className="WalletCard__Info__Money">
              {props.wallet.currency}:&nbsp;
              <div className={(props.wallet.money || 0) >= 0 ? '' : 'negative'}>
                {ParseMoneyAmount(props.wallet.money)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Modals*/}
      {/* Edit Wallet Modal */}
      <WalletForm set={setEdit} state={showEdit} initialWallet={props.wallet} />
    </>
  );
};

export default WalletCard;
