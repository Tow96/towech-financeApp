// External packages
import { ReactNode } from 'react';
import { Archive, ArchiveRestore, CirclePlus, Ellipsis, Pencil } from 'lucide-react';

// App packages
import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerGroup,
  DropDrawerItem,
  DropDrawerSeparator,
  DropDrawerTrigger,
} from '@/lib/shadcn-ui/components/ui/dropdrawer';
import { Button } from '@/lib/shadcn-ui/components/ui/button';

interface CategoryItemMenuProps {
  isChild?: boolean;
  archived?: boolean;
}

export const CategoryItemMenu = (props: CategoryItemMenuProps): ReactNode => {
  return (
    <DropDrawer>
      {/* Button */}
      <DropDrawerTrigger asChild>
        <Button variant="secondary" size="icon" className="ml-3">
          <Ellipsis />
        </Button>
      </DropDrawerTrigger>

      {/* Menu */}
      <DropDrawerContent align="start">
        {/* Add Subcategory */}
        {!props.isChild && !props.archived && (
          <DropDrawerGroup>
            <DropDrawerItem>
              <CirclePlus />
              <span>Add Subcategory</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        )}

        <DropDrawerSeparator />

        {/* Edit / Delete */}
        {!props.archived && (
          <DropDrawerGroup>
            <DropDrawerItem>
              <Pencil />
              <span>Edit Category</span>
            </DropDrawerItem>
            <DropDrawerItem>
              <Archive />
              <span>Archive Category</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        )}

        <DropDrawerSeparator />

        {props.archived && (
          <DropDrawerGroup>
            <DropDrawerItem>
              <ArchiveRestore />
              <span>Restore Category</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        )}
      </DropDrawerContent>
    </DropDrawer>
  );
};
