'use client';
import { ReactNode, useState } from 'react';
import { Archive, ArchiveRestore, Ellipsis, Pencil } from 'lucide-react';

import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerGroup,
  DropDrawerItem,
  DropDrawerTrigger,
} from '@/lib/shadcn-ui/components/ui/dropdrawer';
import { Button } from '@/lib/shadcn-ui/components/ui/button';

import { SubCategoryDto } from '@/lib/categories/data-store';
import { EditSubCategoryDialog } from './edit-subcategory-dialog';
import { ArchiveSubCategoryDialog } from './archive-subcategory-dialog';
import { RestoreSubCategoryDialog } from '@/lib/categories/features/manage-categories/category-item/subcategory-item/restore-subcategory-dialog';

interface SubCategoryItemMenuProps {
  subCategory: SubCategoryDto;
  parentId: string;
}

export const SubCategoryItemMenu = (props: SubCategoryItemMenuProps): ReactNode => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);

  return (
    <DropDrawer>
      {/* All forms (hidden at start) */}
      <EditSubCategoryDialog
        open={openEdit}
        setOpen={setOpenEdit}
        parentId={props.parentId}
        subCategory={props.subCategory}
      />
      <ArchiveSubCategoryDialog
        open={openArchive}
        setOpen={setOpenArchive}
        parentId={props.parentId}
        subCategory={props.subCategory}
      />
      <RestoreSubCategoryDialog
        open={openRestore}
        setOpen={setOpenRestore}
        parentId={props.parentId}
        subCategory={props.subCategory}
      />

      {/* Open Button */}
      <DropDrawerTrigger asChild>
        <Button variant="secondary" size="icon" className="ml-3">
          <Ellipsis />
        </Button>
      </DropDrawerTrigger>

      {/* Menu */}
      {!props.subCategory.archived ? (
        // Regular subcategory menu
        <DropDrawerContent align="start">
          <DropDrawerGroup>
            {/* Edit */}
            <DropDrawerItem icon={<Pencil />} onClick={() => setOpenEdit(true)}>
              <span>Edit SubCategory</span>
            </DropDrawerItem>

            {/* Archive */}
            <DropDrawerItem icon={<Archive />} onClick={() => setOpenArchive(true)}>
              <span>Archive SubCategory</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      ) : (
        <DropDrawerContent align="start">
          <DropDrawerGroup>
            <DropDrawerItem icon={<ArchiveRestore />} onClick={() => setOpenRestore(true)}>
              <span>Restore SubCategory</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      )}
    </DropDrawer>
  );
};
