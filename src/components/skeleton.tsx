/** skeleton
 * Copyright (c) 2024, Towechlabs
 *
 * Skeleton container, used to display something while loading
 */

interface Props {
  children?: React.ReactNode;
  className?: string;
  display: boolean;
}
/**
 * @param {string} props.className - The name of the classes the main container will have
 * @param {boolean} props.display - Flag that shows the skeleton or the content
 * @param {React.ReactNode} props.children - Content that will be displayed when the skeleton is off
 * @returns {React.ReactNode} - A div that will switch between loading and not loading with the flag
 */
export const SkeletonComponent = (props: Props): React.ReactNode => {
  return (
    <div className={`flex ${props.className}`}>
      {props.display ? (
        <span className="m-1 w-full animate-pulse rounded-md bg-riverbed-600">&nbsp;</span>
      ) : (
        props.children
      )}
    </div>
  );
};
