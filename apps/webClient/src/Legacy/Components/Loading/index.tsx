/** Loading.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom loading icon
 */
// Styles
import './Loading.css';
import { ReactElement } from 'react';

interface Props {
  className?: string;
}

const Loading = (props: Props): ReactElement => {
  let theme = 'lds-dual-ring';
  if (props.className) theme += ` ${props.className}`;

  return <div className={theme} />;
};

export default Loading;
