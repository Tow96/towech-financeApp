'use client';
import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Loader2Icon } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/lib/shadcn-ui/components/ui/dialog';
import { Form } from '@/lib/shadcn-ui/components/ui/form';
import { Button } from '@/lib/shadcn-ui/components/ui/button';

import { ErrorBox } from './error-box';

interface FormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: ReactNode;
  form: UseFormReturn<any>; // eslint-disable-line
  onSubmit: (v: any) => void; // eslint-disable-line
  error: Error | null;
  loading: boolean;
}

export const FormDialog = (props: FormDialogProps): ReactNode => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogDescription className="sr-only">Dialog for the {props.title} form</DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>

        <Form {...props.form}>
          <form onSubmit={props.form.handleSubmit(props.onSubmit)}>
            {/* Form content */}
            {props.children}

            {/* Error box */}
            {props.error !== null && (
              <ErrorBox className="mb-4" title="Error" error={props.error} />
            )}

            {/* Form close */}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={props.loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={props.loading}>
                {props.loading && <Loader2Icon className="animate-spin" />}
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
