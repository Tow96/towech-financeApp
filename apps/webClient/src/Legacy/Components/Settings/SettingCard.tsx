/** SettingCard.tsx
 * Copyright (c) 2021, TowechLabs
 * All rights reserved
 *
 * Button used to call the modals for each setting
 */
import { ReactElement } from 'react';

interface Props {
  title: string;
  onClick: () => void;
}

const SettingCard = (props: Props): ReactElement => {
  return (
    <div className="Settings__Card" onClick={props.onClick}>
      <div className="Settings__Card__Main">{props.title}</div>
    </div>
  );
};

export default SettingCard;
