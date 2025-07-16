'use client';
import { ReactNode, useState } from 'react';
import { Ellipsis, Pencil } from 'lucide-react';

import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerGroup,
  DropDrawerItem,
  DropDrawerSeparator,
  DropDrawerTrigger,
} from '@/lib/shadcn-ui/components/ui/dropdrawer';
import { Button } from '@/lib/shadcn-ui/components/ui/button';

import { EditCategoryDialog } from './edit-category-dialog';
import { CategoryDto } from '@/lib/categories/data-store';

interface CategoryItemMenuProps {
  category: CategoryDto;
}

export const CategoryItemMenu = (props: CategoryItemMenuProps): ReactNode => {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <DropDrawer>
      <EditCategoryDialog open={openEdit} setOpen={setOpenEdit} category={props.category} />
      {/* Open Button */}
      <DropDrawerTrigger asChild>
        <Button variant="secondary" size="icon" className="ml-3">
          <Ellipsis />
        </Button>
      </DropDrawerTrigger>

      {/* Menu */}
      {!props.category.archived ? (
        <DropDrawerContent align="start">
          <DropDrawerGroup>
            <DropDrawerItem>TODO</DropDrawerItem>
          </DropDrawerGroup>

          <DropDrawerSeparator />

          {/* Edit */}
          <DropDrawerGroup>
            <DropDrawerItem icon={<Pencil />} onClick={() => setOpenEdit(true)}>
              <span>Edit Category</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      ) : (
        <DropDrawerContent align="start">
          <DropDrawerGroup>
            <DropDrawerItem>TODO</DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      )}
    </DropDrawer>
  );
};
