'use client';
import { ReactNode } from 'react';
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
import { Button } from '@/lib/shadcn-ui/components/ui/button';

import { CategoryDto, useRestoreCategory } from '@/lib/categories/data-store';

// ----------------------------------------------
interface RestoreCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: CategoryDto;
}

export const RestoreCategoryDialog = (props: RestoreCategoryDialogProps): ReactNode => {
  const restoreCategoryMutation = useRestoreCategory();

  async function onConfirm() {
    restoreCategoryMutation.mutate(props.category.id);
    props.setOpen(false);
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogDescription className="sr-only">
        Restore category ${props.category.name}
      </DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore Category</DialogTitle>
        </DialogHeader>
        <p>Are you sure?</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={restoreCategoryMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={restoreCategoryMutation.isPending} onClick={onConfirm}>
            {restoreCategoryMutation.isPending && <Loader2Icon className="animate-spin" />}
            Restore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
