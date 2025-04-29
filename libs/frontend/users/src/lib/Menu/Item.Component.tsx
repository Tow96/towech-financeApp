'use client';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ReactElement } from 'react';
import { usePathname } from 'next/navigation';
import { classNames } from '@financeapp/frontend-common';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  href: string;
  icon: IconProp;
  name: string;
};

export const SettingsMenuItem = (props: Props): ReactElement => {
  const path = usePathname();
  const disabled = path.split('/').slice(-1)[0] === props.href;

  const classes = classNames({
    'active:input-shadow': true,
    'pointer-events-none': disabled,
    flex: true,
    'w-20': true,
    'flex-col': true,
    'items-center': true,
    'p-4': true,
    'bg-golden-500': disabled,
    'text-riverbed-950': disabled,
    underline: disabled,
    'hover:bg-riverbed-700': true,
    'active:bg-riverbed-900': true,
    'focus-visible:outline-none': true,
    'focus-visible:text-golden-500': !disabled,
    'sm:w-auto': true,
    'sm:flex-row': true,
    'sm:p-2': true,
    'md:text-lg': true,
  });

  return (
    <Link
      tabIndex={disabled ? -1 : undefined}
      href={props.href}
      aria-disabled={disabled}
      className={classes}
    >
      <FontAwesomeIcon icon={props.icon} data-testid="icon" width={20} className="sm:pr-2" />
      <div className="line-clamp-1">{props.name}</div>
    </Link>
  );
};
