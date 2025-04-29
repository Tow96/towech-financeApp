/** ErrorBox.tsx
 * Copyright (c) 2022, TowechLabs
 * All rights reserved
 *
 * Component that shows a list containing errors
 */

// Libraries
import * as FaIcons from 'react-icons/fa';

// Components
import Button from '../Button';

// Styles
import './Errorbox.css';
import { Dispatch, ReactElement } from 'react';

interface Props {
  errors: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  setErrors: Dispatch<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const ErrorBox = (props: Props): ReactElement => {
  return (
    <div className={Object.keys(props.errors).length > 0 ? 'errorBox active' : 'errorBox'}>
      {Object.keys(props.errors).length > 0 && (
        <div>
          <div className="errorBox__header">
            <Button
              className="errorBox__close"
              onClick={() => {
                props.setErrors({});
              }}
            >
              <FaIcons.FaTimes />
            </Button>
          </div>
          <div>
            <ul>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {Object.values(props.errors).map((value: any) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorBox;
