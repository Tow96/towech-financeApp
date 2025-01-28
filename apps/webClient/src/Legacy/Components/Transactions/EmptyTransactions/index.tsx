/** index.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Class that contains all the empty placeholders
 */
//Libraries
import Link from 'next/link';
import { ReactElement } from 'react';

export default class Index {
  static RedirectToWallets = (): ReactElement => {
    return (
      <div className="NoTransactions">
        <h1>
          You have no wallets, add one in <Link href="/wallets">Wallets</Link>
        </h1>
      </div>
    );
  };
}
