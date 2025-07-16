'use client';
import { ReactNode, useState } from 'react';
import { Archive, ArchiveRestore, CirclePlus, Ellipsis, Pencil } from 'lucide-react';

import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerGroup,
  DropDrawerItem,
  DropDrawerSeparator,
  DropDrawerTrigger,
} from '@/lib/shadcn-ui/components/ui/dropdrawer';
import { Button } from '@/lib/shadcn-ui/components/ui/button';

import { CategoryDto, MAX_SUBCATEGORIES } from '@/lib/categories/data-store';
import { EditCategoryDialog } from './edit-category-dialog';
import { ArchiveCategoryDialog } from './archive-category-dialog';
import { RestoreCategoryDialog } from './restore-category-dialog';
import { AddSubCategoryDialog } from '@/lib/categories/features/manage-categories/category-item/add-subcategory-dialog';

interface CategoryItemMenuProps {
  category: CategoryDto;
}

export const CategoryItemMenu = (props: CategoryItemMenuProps): ReactNode => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const [openAddSub, setOpenAddSub] = useState(false);

  return (
    <DropDrawer>
      <EditCategoryDialog open={openEdit} setOpen={setOpenEdit} category={props.category} />
      <ArchiveCategoryDialog
        open={openArchive}
        setOpen={setOpenArchive}
        category={props.category}
      />
      <RestoreCategoryDialog
        open={openRestore}
        setOpen={setOpenRestore}
        category={props.category}
      />
      <AddSubCategoryDialog
        open={openAddSub}
        setOpen={setOpenAddSub}
        parentId={props.category.id}
      />

      {/* Open Button */}
      <DropDrawerTrigger asChild>
        <Button variant="secondary" size="icon" className="ml-3">
          <Ellipsis />
        </Button>
      </DropDrawerTrigger>

      {/* Menu */}
      {!props.category.archived ? (
        // Regular category menu
        <DropDrawerContent align="start">
          <DropDrawerGroup>
            <DropDrawerItem
              onClick={() => setOpenAddSub(true)}
              icon={<CirclePlus />}
              disabled={props.category.subCategories.length >= MAX_SUBCATEGORIES}>
              <span>Add SubCategory</span>
            </DropDrawerItem>
          </DropDrawerGroup>

          <DropDrawerSeparator />

          <DropDrawerGroup>
            {/* Edit */}
            <DropDrawerItem icon={<Pencil />} onClick={() => setOpenEdit(true)}>
              <span>Edit Category</span>
            </DropDrawerItem>

            {/* Archive */}
            <DropDrawerItem
              icon={<Archive />}
              onClick={() => setOpenArchive(true)}
              variant="destructive">
              <span>Archive Category</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      ) : (
        // Archived category menu
        <DropDrawerContent align="start">
          <DropDrawerGroup>
            <DropDrawerItem icon={<ArchiveRestore />} onClick={() => setOpenRestore(true)}>
              <span>Restore Category</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      )}
    </DropDrawer>
  );
};
