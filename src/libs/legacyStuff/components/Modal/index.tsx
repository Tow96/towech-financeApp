/** Modal.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Custom modal component
 */
// import React, { useRef, useEffect, useCallback } from 'react';
import React, { useRef } from 'react';
import './Modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components
import { Spinner as Loading } from '../../../../components/spinner';
import { Button } from '../../../../components/button';

interface Props {
  accept?: string | JSX.Element;
  children?: string | JSX.Element | JSX.Element[];
  showModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept?: any;
  onClose?: any;
  title?: string;
  loading?: boolean;
  float?: boolean;
}

const Modal = (props: Props): JSX.Element => {
  let theme = 'Modal__Body';
  if (props.float) theme += ' floated';
  if (props.loading) theme += ' loading';

  const modalRef = useRef();

  // Function that closes the modal
  const closeModal = () => {
    if (props.onClose) props.onClose();
    props.setModal(false);
  };

  // Function that handles the closing of the modal using ref
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
        ref={modalRef as any}
        onClick={closeModalRef}>
        <div className={props.float ? 'ModalFloat__Content' : 'Modal__Content'}>
          {!props.float && (
            <div className={props.loading ? 'Modal__header loading' : 'Modal__header'}>
              <Button className="Modal__header__button" onClick={closeModal}>
                <FontAwesomeIcon icon="times" />
              </Button>
              <div>
                <h1>{props.title ? props.title : ''}</h1>
              </div>
              {(props.accept || props.onAccept) && (
                <Button className="Modal__header__button right" onClick={confirmAction}>
                  {props.accept ? props.accept : <FontAwesomeIcon icon="check" />}
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
                <Button onClick={() => props.setModal(false)}>
                  {props.onAccept ? 'Cancel' : props.accept || 'Ok'}
                </Button>
                {props.onAccept && <Button onClick={confirmAction}>{props.accept || 'Ok'}</Button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
