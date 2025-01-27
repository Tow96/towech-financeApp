import { ReactElement } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  label: string;
  register?: UseFormRegisterReturn<string>;
};

export const Checkbox = ({ register, label }: Props): ReactElement => {
  const id = label.replace(/\s/g, '').toLowerCase();

  return (
    <div className="flex items-center">
      <input
        data-testid="checkbox"
        className="input-shadow peer mr-1 flex h-5 w-5 cursor-pointer appearance-none items-center justify-center rounded bg-riverbed-800 after:hidden after:text-sm after:font-bold after:text-yellow-500 after:content-['X'] after:checked:block focus-visible:outline-none"
        type="checkbox"
        id={id}
        {...register}
      />
      <label
        className="cursor-pointer text-sm font-medium underline-offset-4 transition-all active:font-bold active:text-yellow-500 active:underline active:decoration-dotted peer-focus:font-bold peer-focus:text-yellow-500 peer-focus:underline peer-focus:decoration-dotted"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};
