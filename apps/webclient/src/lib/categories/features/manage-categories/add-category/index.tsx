import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/lib/shadcn-ui/components/ui/dialog';
import { Button } from '@/lib/shadcn-ui/components/ui/button';

import { AddCategoryForm } from './form';

export const AddCategoryButton = () => (<Dialog>
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
</Dialog>)