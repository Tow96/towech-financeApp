/** Notfound.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * 404 - Error component
 */
import React, { ReactElement } from 'react';
import Link from 'next/link';

const NotFound = (): ReactElement => {
  return (
    <>
      <h1>404 - Not Found!</h1>
      <Link href="/apps/webclient/public">Go Home</Link>
    </>
  );
};

export default NotFound;
