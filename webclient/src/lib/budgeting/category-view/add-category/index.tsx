import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/lib/shadcn-ui/components/ui/dialog';

import { AddCategoryForm } from '@/lib/budgeting/category-view/add-category/add-category-form';

export const AddCategoryButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>

        <AddCategoryForm />
      </DialogContent>
    </Dialog>
  );
};
