/** Modal.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom modal component
 */
// import React, { useRef, useEffect, useCallback } from 'react';
import React, { ReactElement, useRef } from 'react';
import './Modal.css';
import * as FaIcons from 'react-icons/fa';

// Components
import Loading from '../Loading';
import Button from '../Button';

interface Props {
  accept?: string | ReactElement;
  children?: string | ReactElement | ReactElement[];
  showModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onClose?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  title?: string;
  loading?: boolean;
  float?: boolean;
}

const Modal = (props: Props): ReactElement => {
  let theme = 'Modal__Body';
  if (props.float) theme += ' floated';
  if (props.loading) theme += ' loading';

  const modalRef = useRef(null);

  // Function that closes the modal
  const closeModal = () => {
    if (props.onClose) props.onClose();
    props.setModal(false);
  };

  // Function that handles the closing of the modal using ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const closeModalRef = (e: any) => {
    if (modalRef.current === e.target) {
      closeModal();
    }
  };

  // Function that is executed when the OK button is pressed

  const confirmAction = (): void => {
    if (props.onAccept) props.onAccept();
    else props.setModal(false);
  };

  // // Keypress detector
  // const keyPress = useCallback(
  //   (e: KeyboardEvent) => {
  //     if (e.key === 'Escape' && props.showModal) {
  //       closeModal();
  //     }
  //   },
  //   [props.setModal, props.showModal],
  // );

  // // useEffect for the keypress
  // useEffect(() => {
  //   document.addEventListener('keydown', keyPress);
  //   return () => document.removeEventListener('keydown', keyPress);
  // }, [keyPress]);

  return (
    <div className={props.showModal ? 'Modal active' : 'Modal'}>
      <div
        className={props.showModal ? 'Modal__background active' : 'Modal__background'}
        ref={modalRef as any} // eslint-disable-line @typescript-eslint/no-explicit-any
        onClick={closeModalRef}
      >
        <div className={props.float ? 'ModalFloat__Content' : 'Modal__Content'}>
          {!props.float && (
            <div className={props.loading ? 'Modal__header loading' : 'Modal__header'}>
              <Button className="Modal__header__button" onClick={closeModal}>
                <FaIcons.FaTimes />
              </Button>
              <div>
                <h1>{props.title ? props.title : ''}</h1>
              </div>
              {(props.accept || props.onAccept) && (
                <Button className="Modal__header__button right" onClick={confirmAction}>
                  {props.accept ? props.accept : <FaIcons.FaCheck />}
                </Button>
              )}
            </div>
          )}
          <div className={theme}>
            {props.loading && <Loading className="Modal__spinner" />}
            {props.children}
          </div>
          {props.float && (
            <div className={props.loading ? 'Modal__Footer loading' : 'Modal__Footer'}>
              <div className="Modal__Confirm">
                <Button dark onClick={() => props.setModal(false)}>
                  {props.onAccept ? 'Cancel' : props.accept || 'Ok'}
                </Button>
                {props.onAccept && (
                  <Button warn onClick={confirmAction}>
                    {props.accept || 'Ok'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
