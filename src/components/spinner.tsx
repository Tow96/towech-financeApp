/** spinner.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Simple loading spinner
 */
// type Props = {
//   size?: number;
// };
// export const Spinner = ({ size = 60 }: Props): JSX.Element => {
export const Spinner = (): JSX.Element => {
  return (
    <span
      role="status"
      className={`aspect-square w-24 animate-spin rounded-full border-8 border-solid border-riverbed-300 border-b-transparent border-t-transparent`}></span>
  );
};
