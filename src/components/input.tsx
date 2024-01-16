/** input.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Text Input component
 */
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label: string;
  register?: UseFormRegisterReturn<string>;
  type?: 'text' | 'password';
}

export const Input = ({
  register,
  label,
  error,
  type = 'text',
  className,
  ...props
}: Props): JSX.Element => {
  const id = label.replace(/\s/g, '').toLowerCase();
  const inputVariableClasses = error
    ? `focus-visible:focused-input-error`
    : `focus-visible:focused-input-shadow`;
  const labelVariableClasses = error
    ? `text-cinnabar-500 font-semibold`
    : `text-riverbed-50 font-normal`;

  return (
    <div className="relative mx-1 mb-5 mt-7 w-full">
      <input
        type={type}
        placeholder=""
        {...register}
        id={id}
        className={`${inputVariableClasses} input-shadow peer box-border w-full rounded border-none bg-riverbed-800 px-2 py-1 text-lg font-normal text-riverbed-50 focus:outline-none ${className}`}
        {...props}
      />
      <label
        data-testid="label"
        htmlFor={id}
        className={`${labelVariableClasses} pointer-events-none absolute left-0 top-0 mx-1 my-1 origin-top-left -translate-y-[10%] translate-x-0 whitespace-nowrap bg-transparent px-1 py-1 text-lg transition-all peer-focus:-translate-y-2/3 peer-focus:translate-x-1 peer-focus:scale-[0.57] peer-[:not(:placeholder-shown)]:-translate-y-2/3 peer-[:not(:placeholder-shown)]:translate-x-1 peer-[:not(:placeholder-shown)]:scale-[0.57] `}>
        {label}
      </label>
    </div>
  );
};
