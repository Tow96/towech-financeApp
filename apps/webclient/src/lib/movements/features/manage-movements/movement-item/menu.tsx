import { ReactNode, useState } from 'react';
import { Ellipsis, Trash } from 'lucide-react';

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

export const MovementItemMenu = ({ movement }: MovementItemMenuProps): ReactNode => {
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
