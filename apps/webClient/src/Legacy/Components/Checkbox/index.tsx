/** Checkbox.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom checkbox component
 */
// Styles
import './Checkbox.css';
import { ReactElement } from 'react';

interface Props {
  accent?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  checked?: boolean;
  dark?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  label?: string;
  name?: string;
  onChange?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Checkbox = (props: Props): ReactElement => {
  // Checks the alternate theme flags and applies it with following hierarchy
  // Accent
  // Dark
  // Light
  let theme = 'checkbox';
  if (props.dark) theme = 'checkbox dark';

  return (
    <div className={theme}>
      <input
        className="checkbox__field"
        checked={props.checked}
        id={props.name}
        name={props.name}
        onChange={props.onChange}
        type="checkbox"
      />
      {props.label && (
        <label className="checkbox__label" htmlFor={props.name}>
          {props.label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
