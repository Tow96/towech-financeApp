import { ReactNode, useState } from 'react';
import { Ellipsis, Pencil, Trash } from 'lucide-react';

import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerGroup,
  DropDrawerItem,
  DropDrawerTrigger,
} from '@/lib/shadcn-ui/components/ui/dropdrawer';
import { Button } from '@/lib/shadcn-ui/components/ui/button';

import { MovementDto } from '@/lib/movements/data-store';
import { DeleteMovementDialog } from '@/lib/movements/features/manage-movements/movement-item/delete-movement-dialog';

interface MovementItemMenuProps {
  movement: MovementDto;
}

export const MovementItemMenu: ReactNode = ({ movement }: MovementItemMenuProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <DropDrawer>
      {/* Forms (hidden at start) */}
      <DeleteMovementDialog open={openDelete} setOpen={setOpenDelete} movement={movement} />

      {/* Menu button */}
      <DropDrawerTrigger asChild>
        <Button variant="secondary" size="icon" className="ml-3">
          <Ellipsis />
        </Button>
      </DropDrawerTrigger>

      <DropDrawerContent align="start">
        <DropDrawerGroup>
          <DropDrawerItem onClick={() => setOpenEdit(true)} icon={<Pencil />}>
            <span>Edit Movement</span>
          </DropDrawerItem>
          <DropDrawerItem
            onClick={() => setOpenDelete(true)}
            icon={<Trash />}
            variant="destructive">
            <span>Delete Movement</span>
          </DropDrawerItem>
        </DropDrawerGroup>
      </DropDrawerContent>
    </DropDrawer>
  );
};
