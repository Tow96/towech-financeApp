/** useForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Contains the hooks and callbacks for the state of the elements of a form
 *
 * @param callback Function that will be executed when the form is submitted
 * @param initialState The inputs of the form
 *
 * @returns clear      (cleans the form)
 * @returns onChange   (event caller to update the values)
 * @returns onSubmit   (call the onSubmit function)
 * @returns values     (object with the read-only values for binding)
 */
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UseForm = (callback: any, initialState: any) => {
  const [values, setValues] = useState(initialState);

  // Resets the values and cleans the form
  const clear = () => {
    setValues(initialState);
  };

  // Function ran when the contents of the form change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (data: any) => {
    // const onChange = (_, data) => {
    // console.log(data.target);
    switch (data.target.type) {
      // switch (data.type) {
      case 'checkbox':
        setValues({ ...values, [data.target.name]: data.target.checked });
        break;
      case 'text':
      case 'number':
      case 'password':
      case 'custom-select':
        setValues({ ...values, [data.target.name]: data.target.value });
        break;
      case 'select-one':
        setValues({
          ...values,
          [data.target.name]: data.target.options[data.target.selectedIndex].value,
        });
        break;
      default:
        console.log(`No onChange routine for type: ${data.target.type}`);
    }
  };

  // Runs the callback function when the form is submitted
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (event: any) => {
    event.preventDefault(); // Stops the page from reloading when pressing enter
    callback();
  };

  return {
    clear,
    onChange,
    onSubmit,
    values,
  };
};

export default UseForm;
