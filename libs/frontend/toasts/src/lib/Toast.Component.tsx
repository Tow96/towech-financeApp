/** Toast.Component.tsx
 * Copyright (c) 2023, TowechLabs
 *
 * Toast component
 */
'use client';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Toast, useDismissToast } from './Toast.Service';
import { classNames } from '@financeapp/frontend-common';

export const ToastComponent = ({ toast }: { toast: Toast }): ReactElement => {
  const duration = 3000;

  const [visible, setVisible] = useState(false);
  const dismiss = useDismissToast();
  useEffect(() => {
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
    setTimeout(() => dismiss(toast.id), duration + 1000);
  }, [dismiss, toast]);

  const text = classNames({ 'text-transparent': !visible });
  const color = classNames({
    'bg-golden-500': true,
    '!bg-cinnabar-500': toast.type === 'error',
    '!bg-mint-500': toast.type === 'success',
  });

  const transitionRef = useRef(null);
  const transitionCls = {
    enter: 'translate-x-96 opacity-0',
    enterActive: 'duration-500 transition-all !translate-x-0 opacity-100',
    enterDone: '!translate-x-0 opacity-100',
    exit: 'translate-x-0 opacity-100',
    exitActive: 'transition-all duration-500 !translate-x-96 opacity-0',
    exitDone: '!translate-x-96 opacity-0',
  };

  return (
    <CSSTransition nodeRef={transitionRef} timeout={1000} classNames={transitionCls} in={visible}>
      <div
        role="alert"
        ref={transitionRef}
        className="mb-4 flex h-12 translate-x-96 items-center rounded-md bg-riverbed-900 shadow-lg drop-shadow-lg"
      >
        <div data-testid="accent" className={`h-full w-4 rounded-l-md ${color}`}></div>
        <div role="alertdialog" className={`w-36 pl-4 pr-2 ${text}`}>
          {toast.message}
        </div>
      </div>
    </CSSTransition>
  );
};
