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
    'sm:p-2': true,
    'p-4': true,
    'w-20': true,
    'sm:w-auto': true,
    'hover:bg-riverbed-700': true,
    'hover:text-golden-500': true,
    'active:bg-riverbed-900': true,
    'pointer-events-none': disabled,
    underline: disabled,
    'bg-golden-500': disabled,
    'text-riverbed-950': disabled,
    flex: true,
    'flex-col': true,
    'items-center': true,
    'sm:block': true,
  });

  return (
    <Link
      tabIndex={disabled ? -1 : undefined}
      href={props.href}
      aria-disabled={disabled}
      className={classes}>
      <FontAwesomeIcon icon={props.icon} data-testid="icon" width={20} className="sm:pr-2" />
      {props.name}
    </Link>
  );
};
