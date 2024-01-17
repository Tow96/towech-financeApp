import { classNames } from '@/utils/ConditionalClasses';

/** spinner.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Simple loading spinner
 */
type Props = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};
export const Spinner = ({ size = 'lg', className }: Props): JSX.Element => {
  const variableClasses = classNames({
    'w-24 border-8': size === 'lg',
    'w-4 border-2': size === 'xs',
  });
  return (
    <span
      role="status"
      className={`block aspect-square animate-spin rounded-full border-solid border-b-transparent border-t-transparent ${variableClasses} ${className}`}></span>
  );
};
