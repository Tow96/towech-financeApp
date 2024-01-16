/** menuItem.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Buttons for the menu of the settings page
 */
'use client';
// Libraries ------------------------------------------------------------------
import '@/libs/feature-icons/icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Link from 'next/link';
// Hooks ----------------------------------------------------------------------
import { usePathname } from 'next/navigation';
// Used components ------------------------------------------------------------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { classNames } from '@/utils/ConditionalClasses';

// Types ----------------------------------------------------------------------
type Props = {
  href: string;
  icon: IconProp;
  name: string;
};

// Component ------------------------------------------------------------------
export const SettingsMenuItem = (props: Props): JSX.Element => {
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
      className={classes}>
      <FontAwesomeIcon icon={props.icon} data-testid="icon" width={20} className="sm:pr-2" />
      <div className="line-clamp-1">{props.name}</div>
    </Link>
  );
};
