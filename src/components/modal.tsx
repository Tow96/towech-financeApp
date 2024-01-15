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
  title: string;
  onClose?: () => void;
  onOk?: () => void;
  children?: React.ReactNode;
  param?: string;
};

// Component ------------------------------------------------------------------
export const Modal = ({ title, onClose, onOk, children, param }: Props): JSX.Element | null => {
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
    <dialog ref={dialogRef} className="w-4/5 sm:w-96">
      <div className="bg-riverbed-800 p-4 text-riverbed-50">
        <div className="flex justify-between">
          <h2>{title}</h2>
          <button onClick={closeDialog}>X</button>
        </div>
        <div className="my-3 block border-b-2 border-riverbed-900"></div>
        <div>{children}</div>
        <div className="flex justify-end">
          <Button onClick={confirmDialog}>Ok</Button>
        </div>
      </div>
    </dialog>
  );
};
