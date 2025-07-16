'use client';
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

import { CategoryDto, useArchiveCategory } from '@/lib/categories/data-store';

// ----------------------------------------------
interface ArchiveCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: CategoryDto;
}

export const ArchiveCategoryDialog = (props: ArchiveCategoryDialogProps): ReactNode => {
  const archiveCategoryMutation = useArchiveCategory();

  async function onConfirm() {
    archiveCategoryMutation.mutate(props.category.id);
    props.setOpen(false);
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogDescription className="sr-only">
        Archive category ${props.category.name}
      </DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive Category</DialogTitle>
        </DialogHeader>
        <p>
          Once archived, no new movements or budgets under this category can be made until it is
          restored.
        </p>
        <p>Are you sure?</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={archiveCategoryMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={archiveCategoryMutation.isPending}
            onClick={onConfirm}>
            {archiveCategoryMutation.isPending && <Loader2Icon className="animate-spin" />}
            Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
