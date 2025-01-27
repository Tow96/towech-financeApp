import { ButtonHTMLAttributes, ReactElement } from 'react';
import { classNames } from '../ConditionalClasses';
import { SpinnerComponent } from './Spinner.Component';

// Types ----------------------------------------------------------------------
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'accent' | 'danger';
  loading?: boolean;
}

export const Button = ({
  type = 'button',
  color = 'accent',
  disabled = false,
  loading = false,
  children,
  ...props
}: Props): ReactElement => {
  const variableClasses = classNames({
    'bg-golden-400 text-golden-950 hover:bg-golden-300 active:bg-golden-500 focus-visible:focused-button-shadow disabled:bg-golden-400':
      color === 'accent',
    'bg-cinnabar-300 text-cinnabar-900 hover:bg-cinnabar-200 active:bg-cinnabar-400 focus-visible:focused-danger-button-shadow disabled:bg-cinnabar-300':
      color === 'danger',
    'px-3': loading,
    'px-6': !loading,
  });
  const spinnerClass = classNames({
    'mr-2': true,
    'border-golden-950': color === 'accent',
    'border-cinnabar-900': color === 'danger',
  });

  return (
    <button
      {...props}
      disabled={disabled}
      type={type}
      aria-busy={loading}
      className={`button-shadow active:input-shadow disabled:button-shadow-disabled relative flex items-center rounded-lg py-2 font-semibold transition duration-200 focus-visible:outline-none disabled:opacity-75 ${variableClasses} `}
    >
      {loading && <SpinnerComponent size="xs" className={spinnerClass} />}
      <div>{children}</div>
    </button>
  );
};
