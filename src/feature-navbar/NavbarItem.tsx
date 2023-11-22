/** NavbarItem.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Item that is used in a navbar
 */
import { Dispatch, SetStateAction, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import Link from 'next/link';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '@/feature-icons/icons';
import { classNames } from '@/utils/ConditionalClasses';

type NavbarItemProps = NavbarLinkProps | NavbarButtonProps;
export const NavbarItem = (props: NavbarItemProps): JSX.Element => {
  if (props.type === 'button') return <NavbarButton {...props} />;
  return <NavbarLink {...props} />;
};

// Common things shared bewtween the Link and the Button ----------------------
type ItemProps = {
  collapsed: boolean;
  icon?: IconProp;
  name: string;
};
const getClasses = (disabled: boolean): string => {
  const baseClasses =
    'transition-all underline-offset-4 decoration-dotted mx-2 my-1 block rounded-md px-3 py-2 font-semibold focus-visible:bg-golden-400 focus-visible:outline-none';
  const variableClasses = classNames({
    'hover:bg-riverbed-700': !disabled,
    'active:input-shadow': !disabled,
    'active:bg-riverbed-900': !disabled,
    'text-golden-500': disabled,
    underline: disabled,
  });
  return `${baseClasses} ${variableClasses}`;
};
const ItemContent = (props: ItemProps): JSX.Element => {
  const { icon = 'right-from-bracket', name, collapsed } = props;
  const transitionRef = useRef(null);
  const transitionCls = {
    enter: 'w-0 opacity-0',
    enterActive: 'transition-all !w-full !opacity-100',
    enterDone: 'w-full opacity-100',
    exit: 'w-full opacity-100',
    exitActive: 'transition-all !w-0 !opacity-0',
    exitDone: 'w-0 opacity-0',
  };

  return (
    <div className="flex w-auto items-center transition-all">
      <div className="flex items-center justify-center">
        <FontAwesomeIcon icon={icon} size="2x" width={40} />
      </div>
      <CSSTransition
        mountOnEnter={true}
        unmountOnExit={true}
        nodeRef={transitionRef}
        timeout={100}
        classNames={transitionCls}
        in={!collapsed}>
        <div ref={transitionRef} className="pl-4 text-lg">
          {name}
        </div>
      </CSSTransition>
    </div>
  );
};

// Navbar Button --------------------------------------------------------------
type NavbarButtonProps = ItemProps & {
  type: 'button';
  click: () => void;
};
const NavbarButton = (props: NavbarButtonProps): JSX.Element => (
  <button onClick={props.click} className={getClasses(false)}>
    <ItemContent {...props} />
  </button>
);

// Navbar Link ----------------------------------------------------------------
type NavbarLinkProps = ItemProps & {
  type: 'link';
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  current: string;
  href: string;
};
const NavbarLink = (props: NavbarLinkProps): JSX.Element => {
  const disabled = props.href.startsWith(props.current);
  const classes = getClasses(disabled);
  const content = <ItemContent {...props} />;

  if (disabled) return <div className={classes}>{content}</div>;
  return (
    <Link href={props.href} className={classes} onClick={() => props.setCollapsed(true)}>
      {content}
    </Link>
  );
};
