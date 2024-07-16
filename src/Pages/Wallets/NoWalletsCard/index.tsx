/** NoWalletsCard.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The Componet for what is shown when the user has no Wallets
 */
// Styles
import './NoWalletsCard.css';

const NoWalletsCard = (): JSX.Element => {
  return (
    <div className="NoWallets">
      <h1>You don't have any wallets, yet.</h1>
    </div>
  );
};

export default NoWalletsCard;
