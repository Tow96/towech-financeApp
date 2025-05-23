/** index.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The Component for what is shown when the user has no Wallets
 */

import './NoWalletsCard.css';
import { ReactElement } from 'react';

const NoWalletsCard = (): ReactElement => {
  return (
    <div className="NoWallets">
      <h1>You don&apos;t have any wallets, yet.</h1>
    </div>
  );
};

export default NoWalletsCard;
