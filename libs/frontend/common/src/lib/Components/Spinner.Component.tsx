/** spinner.tsx
 * Copyright (c) 2023, TowechLabs
 *
 * Simple loading spinner
 */

import { classNames } from '../ConditionalClasses';
import { ReactElement } from 'react';

type Props = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};
export const SpinnerComponent = ({ size = 'lg', className }: Props): ReactElement => {
  const variableClasses = classNames({
    'w-24 border-8': size === 'lg',
    'w-12 border-4': size === 'md',
    'w-8 border-4': size === 'sm',
    'w-4 border-2': size === 'xs',
  });
  return (
    <span
      role="status"
      className={`block aspect-square animate-spin rounded-full border-solid border-b-transparent border-t-transparent ${variableClasses} ${className}`}
    ></span>
  );
};
