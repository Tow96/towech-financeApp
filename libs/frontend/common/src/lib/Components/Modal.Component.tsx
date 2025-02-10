'use client';
import { ReactElement, ReactNode, useEffect, useRef } from 'react';
// Hooks
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// Components
import { Button } from './Button.Component';

type Props = {
  color?: 'accent' | 'danger';
  title: string;
  onClose?: () => void;
  onOk?: () => void;
  children?: ReactNode;
  param?: string;
};

export const Modal = (props: Props): ReactElement | null => {
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogParam = props.param || 'showDialog';

  // Close listener -------------------------------------------------
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    const dialog = dialogRef.current;
    const clearShowDialogParam = () => {
      const params = new URLSearchParams(searchParams);
      params.delete(dialogParam);
      router.replace(`${path}?${params.toString()}`);
    };
    dialog?.addEventListener('close', clearShowDialogParam);
    return () => dialog?.removeEventListener('close', clearShowDialogParam);
  }, [dialogRef, searchParams, dialogParam, path, router]);

  // Open/Close Effect ----------------------------------------------
  const showDialog = searchParams.get(dialogParam) === 'y';
  useEffect(() => {
    if (showDialog) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  });

  // OnClose/OnConfirm ----------------------------------------------
  const closeDialog = () => {
    dialogRef.current?.close();
    if (props.onClose) props.onClose();
  };
  const confirmDialog = () => {
    if (props.onOk) props.onOk();
    closeDialog();
  };

  // Render ---------------------------------------------------------
  if (!showDialog) return null;
  return (
    <dialog ref={dialogRef} className="w-4/5 shadow-2xl drop-shadow-2xl sm:w-96">
      <div className="bg-riverbed-800 text-riverbed-50 p-5">
        <div className="flex items-start justify-between">
          <h2 className="text-xl sm:text-2xl">{props.title}</h2>
          <button
            onClick={closeDialog}
            className="active:input-shadow hover:bg-riverbed-700 active:bg-riverbed-900 aspect-square w-8 rounded-full text-lg font-extrabold"
          >
            X
          </button>
        </div>
        <div className="border-riverbed-900 my-3 block border-b-2"></div>
        <div className="pb-4 sm:text-sm">{props.children}</div>
        <div className="flex justify-end">
          <Button color={props.color} onClick={confirmDialog} text="Ok" />
        </div>
      </div>
    </dialog>
  );
};
