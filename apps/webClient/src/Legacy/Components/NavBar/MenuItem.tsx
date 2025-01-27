/** MenuItem.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Component that defines the menu Items
 */
'use client';
import Link from 'next/link';

// Styles
import './MenuItem.css';

interface Props {
  children?: JSX.Element;
  link?: string;
  onClick?: any;
  label?: string;
  selected?: boolean;
}

const MenuItem = (props: Props): JSX.Element => {
  // Checks the the alternate theme flags and applies it with following hierarchy
  // Accent
  // Dark
  // Light
  let theme = 'MenuItem';

  // If this item is selected, adds the color
  if (props.selected) theme += ' selected';

  return (
    <div onClick={props.onClick}>
      <Link className={theme} href={props.link || '/apps/webclient/public'}>
        <div>{props.children}</div>
        <p>{props.label}</p>
      </Link>
    </div>
  );
};

export default MenuItem;
