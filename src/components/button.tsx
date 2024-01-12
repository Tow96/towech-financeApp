/** button.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Simple button component
 */
// Types ----------------------------------------------------------------------
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'accent' | 'success' | 'error' | 'warning';
}

export const Button = ({
  type = 'button',
  color = 'accent',
  disabled = false,
  ...props
}: Props): JSX.Element => {
  let variableClasses = '';

  switch (color) {
    // TODO: button colors
    default:
      variableClasses = `bg-golden-500 hover:bg-golden-400 active:bg-golden-600 text-riverbed-950 focus-visible:focused-button-shadow disabled:bg-golden-300 disabled:button-shadow-disabled disabled:text-riverbed-600`;
  }

  return (
    <button
      {...props}
      disabled={disabled}
      type={type}
      className={`button-shadow active:input-shadow rounded-lg px-4 py-2 text-lg font-semibold transition-shadow focus-visible:outline-none ${variableClasses}`}
    />
  );
};
