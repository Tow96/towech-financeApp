/** Button.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom button component
 */
// Styles
import './Button.css';
import { ReactElement } from 'react';

interface Props {
  accent?: boolean;
  dark?: boolean;
  warn?: boolean;
  children?: ReactElement | string;
  className?: string;
  round?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Button = (props: Props): ReactElement => {
  // Checks the alternate theme flags and applies it with following hierarchy
  // Accent
  // Dark
  // Light
  let theme = 'button';
  if (props.dark) theme = 'button dark';
  if (props.accent) theme = 'button accent';
  if (props.warn) theme = 'button warn';

  // Sets the roundness of the button
  if (props.round) theme += ' round';

  // Sets the button as transparent

  return (
    <button className={`${theme} ${props.className}`} type={props.type} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
