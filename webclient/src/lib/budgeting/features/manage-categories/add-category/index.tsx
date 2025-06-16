// External packages
import { Plus } from 'lucide-react';

// App packages
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/lib/shadcn-ui/components/ui/dialog';
import { Button } from '@/lib/shadcn-ui/components/ui/button';

// Data Store

// Internal references
import { AddCategoryForm } from './form';


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
