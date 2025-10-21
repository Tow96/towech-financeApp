'use client';
import { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormDialog } from '@/lib/webclient';
import { MovementDto, useDeleteMovement } from '@/lib/movements/data-store';

interface DeleteMovementDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  movement: MovementDto;
}

export const DeleteMovementDialog = (props: DeleteMovementDialogProps): ReactNode => {
  const deleteMovementMutation = useDeleteMovement();

  const formSchema = z.object({ id: z.string() });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: props.movement.id },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    deleteMovementMutation.mutate(values, { onSettled: () => props.setOpen(false) });

  return (
    <FormDialog
      open={props.open}
      setOpen={props.setOpen}
      title="Delete Movement"
      form={form}
      onSubmit={onSubmit}
      error={deleteMovementMutation.error}
      loading={deleteMovementMutation.isPending}>
      <p>This cannot be undone</p>
      <p>Are you sure?</p>
    </FormDialog>
  );
};
