/** Input.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom input component
 */

// Styles
import { useState, useEffect } from 'react';
import './Input.css';

interface Props {
  error?: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  onChange?: any;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
  value?: any;
}

const Input = (props: Props): JSX.Element => {
  // const inputRef = useRef(new HTMLInputElement);
  const [value, setValue] = useState(props.value || '');

  // Checks the the alternate theme flags and applies it with following hierarchy
  let theme = 'input';

  // Adds the error outline if triggered
  if (props.error) theme += ' error';

  // This useEffect is used when something external changes the value of the input
  useEffect(() => {
    let newValue = props.value || '';

    if (props.type === 'number') {
      const [formatted] = formatNumber(newValue);
      newValue = formatted;
    }

    // Doesn't trigger a rerender if there are no changes
    if (newValue === value) return;

    setValue(newValue);
  }, [props.value]);

  // Formats a given string into a number and a string with commas
  const formatNumber = (input: string): string[] => {
    const output = ['0', '0'];

    // If the current value is 0, it gets replaced to nothing
    let workingValue = value === '0' ? input.replace('0', '') : input;

    // First removes dots after the first
    const splitted = workingValue.split('.');
    workingValue = splitted.length > 1 ? `${splitted.shift()}.${splitted.join('')}` : `${splitted[0]}`;

    // Then removes all symbols that are not numbers or dots
    workingValue = workingValue.replace(/[^0-9.]/g, '');

    // If there is an empty value, a 0 is returned
    if (workingValue.trim() === '') workingValue = '0';

    // Changes the e.target.value to this number, as it is what will be passed down
    output[1] = workingValue;

    // Finally, formats the newValue to contain the commas in the correct positions
    const formatSplit = workingValue.split('.');
    output[0] =
      formatSplit.length > 1
        ? `${formatSplit[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${formatSplit[1]}`
        : `${formatSplit[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

    return output;
  };

  // Function that runs everytime the input content changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let newValue = e.target.value;

    // Number filter
    if (props.type === 'number') {
      // Runs the filter
      const [formatted, pure] = formatNumber(newValue);

      // Changes the e.target.value to this number, as it is what will be passed down
      e.target.value = pure;

      // Sets the formatted number as the new value
      newValue = formatted;
    }

    // Doesn't trigger a rerender if there are no changes
    if (newValue === value) return;

    setValue(newValue);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Sets the correct type of input
  const getType = (): string => {
    if (!props.type) return 'text';
    if (props.type === 'number') return 'text';
    return props.type;
  };

  return (
    <div className={theme}>
      <input
        className={props.type === 'number' ? 'input__field number' : 'input__field'}
        disabled={props.disabled}
        name={props.name}
        onChange={handleChange}
        placeholder={props.placeholder ? props.placeholder : ' '}
        type={getType()}
        value={value}
      />
      {props.label && <label className="input__label">{props.label}</label>}
    </div>
  );
};

export default Input;
