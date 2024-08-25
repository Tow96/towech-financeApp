/** Errorbox.tsx
 * Copyright (c) 2022, Towechlabs
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

interface Props {
  errors: any;
  setErrors: React.Dispatch<any>;
}

const Errorbox = (props: Props): JSX.Element => {
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

export default Errorbox;
