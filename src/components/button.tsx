/** button.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Simple button component
 */
type Props = {
  type?: 'button' | 'reset' | 'submit';
  color?: 'accent' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
};

export const Button = ({ type = 'button', color = 'accent', children }: Props): JSX.Element => {
  let variableClasses = '';

  switch (color) {
    // TODO: button colors
    default:
      variableClasses = `bg-golden-500 hover:bg-golden-400 active:bg-golden-600 text-riverbed-950 focus-visible:focused-button-shadow`;
  }

  return (
    <button
      type={type}
      className={`${variableClasses} button-shadow active:input-shadow rounded-lg px-4 py-2 text-lg font-semibold transition-shadow focus-visible:outline-none`}>
      {children}
    </button>
  );
};
