import { classNames } from '@/utils/ConditionalClasses';

/** spinner.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Simple loading spinner
 */
type Props = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: '300' | '600' | '950';
  className?: string;
};
export const Spinner = ({ size = 'lg', color = '300', className }: Props): JSX.Element => {
  const variableClasses = classNames({
    'w-24 border-8': size === 'lg',
    'w-4 border-2': size === 'xs',

    'border-riverbed-300': color === '300',
    'border-riverbed-600': color === '600',
    'border-riverbed-950': color === '950',
  });
  return (
    <span
      role="status"
      className={`block aspect-square animate-spin rounded-full border-solid border-b-transparent border-t-transparent ${variableClasses} ${className}`}></span>
  );
};
