/** Notfound.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * 404 - Error component
 */
import React from 'react';
import Link from 'next/link';

const NotFound = (): JSX.Element => {
  return (
    <>
      <h1>404 - Not Found!</h1>
      <Link href="/">Go Home</Link>
    </>
  );
};

export default NotFound;
