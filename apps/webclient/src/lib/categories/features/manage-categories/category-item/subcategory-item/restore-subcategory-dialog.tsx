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

import { SubCategoryDto, useRestoreSubCategory } from '@/lib/categories/data-store';

// ----------------------------------------------
interface RestoreSubCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentId: string;
  subCategory: SubCategoryDto;
}

export const RestoreSubCategoryDialog = (props: RestoreSubCategoryDialogProps): ReactNode => {
  const restoreSubCategoryMutation = useRestoreSubCategory();

  async function onConfirm() {
    restoreSubCategoryMutation.mutate({
      parentId: props.parentId,
      id: props.subCategory.id,
    });
    props.setOpen(false);
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogDescription className="sr-only">
        Restore sub category ${props.subCategory.name}
      </DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore SubCategory</DialogTitle>
        </DialogHeader>
        <p>Are you sure?</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={restoreSubCategoryMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={restoreSubCategoryMutation.isPending} onClick={onConfirm}>
            {restoreSubCategoryMutation.isPending && <Loader2Icon className="animate-spin" />}
            Restore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
