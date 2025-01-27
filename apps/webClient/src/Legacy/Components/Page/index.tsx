/** Page.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component used by all pages in the App
 */
import Loading from '../Loading';
import NavBar from '../NavBar';
import './Page.css';

interface Props {
  children?: JSX.Element | string;
  header?: JSX.Element | string;
  loading?: boolean;
  selected?: string;
}

const Page = (props: Props): JSX.Element => {
  let theme = 'Page';

  // If the page is loading, shows the spinner
  if (props.loading) theme += ' loading';

  return (
    <div className={theme}>
      <NavBar selected={props.selected} />
      <div>{props.header}</div>
      <div className="Page__content">{props.children}</div>
      {props.loading && <Loading className="Page__spinner" />}
    </div>
  );
};

export default Page;
