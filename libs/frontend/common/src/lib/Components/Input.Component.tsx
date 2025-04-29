import { classNames } from '../ConditionalClasses';
import { InputHTMLAttributes, ReactElement } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
  label: string;
  register?: UseFormRegisterReturn<string>;
  type?: 'text' | 'password' | 'number';
}

export const Input = ({
  register,
  label,
  error = false,
  type = 'text',
  className,
  ...props
}: Props): ReactElement => {
  const id = label.replace(/\s/g, '').toLowerCase();

  const inputVariableClasses = classNames({
    'focus-visible:focused-input-error': !!error,
    'text-riverbed-50': true,
    'focus-visible:focused-input-shadow': !error,
  });
  const labelVariableClasses = classNames({
    'text-cinnabar-500': !!error,
    'font-semibold': !!error,
    'text-riverbed-50': !error,
    'font-normal': !error,
  });

  return (
    <div className="relative mb-2 mt-7 w-full pb-2">
      <input
        type={type}
        placeholder=""
        {...register}
        id={id}
        className={`${inputVariableClasses} input-shadow bg-riverbed-800 peer box-border w-full rounded border-none px-2 py-1 text-lg font-normal focus:outline-none disabled:opacity-75 disabled:shadow-none ${className}`}
        {...props}
      />
      <label
        data-testid="label"
        htmlFor={id}
        className={`${labelVariableClasses} pointer-events-none absolute left-0 top-0 mx-1 my-1 origin-top-left -translate-y-[10%] translate-x-0 whitespace-nowrap bg-transparent px-1 py-1 text-lg transition-all peer-focus:-translate-y-[80%] peer-focus:translate-x-1 peer-focus:scale-[0.7] peer-[:not(:placeholder-shown)]:-translate-y-[80%] peer-[:not(:placeholder-shown)]:translate-x-1 peer-[:not(:placeholder-shown)]:scale-[0.7]`}
      >
        {label}
      </label>
      <div className="h-4">
        {!!error && typeof error === 'string' && (
          <p className="text-cinnabar-300 pl-3 pt-1 text-xs">{error}</p>
        )}
      </div>
    </div>
  );
};
