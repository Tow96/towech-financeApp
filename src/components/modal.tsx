/** modal.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Component that renders an HTML dialog tag
 */
'use client';
// Libraries ------------------------------------------------------------------
// Hooks ----------------------------------------------------------------------
import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// Used components ------------------------------------------------------------
import { Button } from './button';

// Types ----------------------------------------------------------------------
type Props = {
  color?: 'accent' | 'danger';
  title: string;
  onClose?: () => void;
  onOk?: () => void;
  children?: React.ReactNode;
  param?: string;
};

// Component ------------------------------------------------------------------
export const Modal = ({
  color,
  title,
  onClose,
  onOk,
  children,
  param,
}: Props): JSX.Element | null => {
  const router = useRouter();
  const path = usePathname();

  const dialogParam = param || 'showDialog';
  const dialogRef = useRef<null | HTMLDialogElement>(null);

  const searchParams = useSearchParams();
  const showDialog = searchParams.get(dialogParam) === 'y';

  // Open/Close Effect --------------------------
  useEffect(() => {
    if (showDialog) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [showDialog]);

  // Close Listener -----------------------------
  useEffect(() => {
    const dialog = dialogRef.current;

    const removeParam = () => {
      const params = new URLSearchParams(searchParams);
      params.delete(dialogParam);
      router.replace(`${path}?${params}`);
    };

    dialog?.addEventListener('close', removeParam);
    return () => dialog?.removeEventListener('close', removeParam);
  }, [dialogRef, searchParams, dialogParam, path, router]);

  // OnClose/OnConfirm --------------------------
  const closeDialog = () => {
    dialogRef.current?.close();
    if (onClose) onClose();
  };
  const confirmDialog = () => {
    if (onOk) onOk();
    closeDialog();
  };

  // Render -------------------------------------
  if (!showDialog) return null;
  return (
    <dialog ref={dialogRef} className="w-4/5 shadow-2xl drop-shadow-2xl sm:w-96">
      <div className="bg-riverbed-800 p-4 text-riverbed-50">
        <div className="flex items-start justify-between">
          <h2 className="text-xl sm:text-2xl">{title}</h2>
          <button
            onClick={closeDialog}
            className="active:input-shadow aspect-square w-8 rounded-full text-lg font-extrabold hover:bg-riverbed-700 active:bg-riverbed-900"
            data-testid="close-button">
            X
          </button>
        </div>
        <div className="my-3 block border-b-2 border-riverbed-900"></div>
        <div className="pb-4 sm:text-sm">{children}</div>
        <div className="flex justify-end">
          <Button color={color} onClick={confirmDialog}>
            Ok
          </Button>
        </div>
      </div>
    </dialog>
  );
};
