/** IconSelector.tsx
 * Copyright (c) 2022, TowechLabs
 * All rights reserved
 *
 * Component that allows a user to select icons
 */
// Libraries
import React, { ReactElement, SVGProps, useEffect, useState } from 'react';

// Components
import Modal from '../Modal';
import { IdIcons } from '../../Icons';

// Styles
import './IconSelector.css';

interface IconSelectorProps extends SVGProps<SVGSVGElement> {
  name?: string;
  onChange?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  value?: number;
}

const IconSelector = (props: IconSelectorProps): ReactElement => {
  const [display, setDisplay] = useState(props.value || 0);
  const [showSelector, setShowSelector] = useState(false);

  // This useEffect is used when something external changes the value of the input
  useEffect(() => {
    setDisplay(props.value || 0);
  }, [props.value]);

  const selectIcon = (id: number) => {
    if (props.onChange) {
      props.onChange({
        target: {
          type: 'custom-select',
          name: props.name,
          value: id,
        },
      });
    } else {
      setDisplay(id);
    }
    setShowSelector(false);
  };

  return (
    <div className="IconSelector">
      <IdIcons.Variable iconId={display} onClick={() => setShowSelector(true)} {...props} />
      <Modal setModal={setShowSelector} showModal={showSelector} title="Select icon">
        <div className="IconSelector__Grid">
          {(() => {
            const icons: ReactElement[] = [];
            for (let i = 1; i <= IdIcons.amount; i++) {
              icons.push(
                <IdIcons.Variable
                  key={i}
                  iconId={i}
                  className="IconSelector__Grid__Icon"
                  onClick={() => selectIcon(i)}
                />
              );
            }
            return icons;
          })()}
        </div>
      </Modal>
    </div>
  );
};

export default IconSelector;
