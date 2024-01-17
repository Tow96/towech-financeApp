/** button.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Simple button component
 */

import { classNames } from '@/utils/ConditionalClasses';
import { Spinner } from './spinner';

// Types ----------------------------------------------------------------------
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'accent' | 'success' | 'error' | 'warning';
  loading?: boolean;
}

export const Button = ({
  type = 'button',
  color = 'accent',
  disabled = false,
  loading = false,
  children,
  ...props
}: Props): JSX.Element => {
  const variableClasses = classNames({
    // TODO: button colors
    'bg-golden-500 hover:bg-golden-400 active:bg-golden-600 text-riverbed-950 focus-visible:focused-button-shadow disabled:bg-golden-300 disabled:button-shadow-disabled disabled:text-riverbed-600':
      true,
    'px-3': loading,
    'px-6': !loading,
  });

  return (
    <button
      {...props}
      disabled={disabled}
      type={type}
      aria-busy={loading}
      className={`button-shadow active:input-shadow relative flex items-center rounded-lg py-2 font-semibold transition duration-200 focus-visible:outline-none ${variableClasses}`}>
      {loading && <Spinner size="xs" color={disabled ? '600' : '950'} className="mr-2" />}
      <div>{children}</div>
    </button>
  );
};
