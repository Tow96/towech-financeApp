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

import { SubCategoryDto, useArchiveSubCategory } from '@/lib/categories/data-store';

// ----------------------------------------------
interface ArchiveSubCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentId: string;
  subCategory: SubCategoryDto;
}

export const ArchiveSubCategoryDialog = (props: ArchiveSubCategoryDialogProps): ReactNode => {
  const archiveSubCategoryMutation = useArchiveSubCategory();

  async function onConfirm() {
    archiveSubCategoryMutation.mutate({
      parentId: props.parentId,
      id: props.subCategory.id,
    });
    props.setOpen(false);
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogDescription className="sr-only">
        Archive SubCategory ${props.subCategory.id}
      </DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive SubCategory</DialogTitle>
        </DialogHeader>
        <p>
          Once archived, no new movements or budgets under this category can be made until it is
          restored
        </p>
        <p>Are you sure?</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={archiveSubCategoryMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={archiveSubCategoryMutation.isPending}
            onClick={onConfirm}>
            {archiveSubCategoryMutation.isPending && <Loader2Icon className="animate-spin" />}
            Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
