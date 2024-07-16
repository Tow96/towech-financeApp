/** EmptyTransactions.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Class that contains all the empty placeholders
 */
//Libraries
import { Link } from 'react-router-dom';
// Styles
import './EmptyTransactions.css';

export default class EmptyTransactions {
  static RedirectToWallets = (): JSX.Element => {
    return (
      <div className="NoTransactions">
        <h1>
          You have no wallets, add one in <Link to="/wallets">Wallets</Link>
        </h1>
      </div>
    );
  };
}
