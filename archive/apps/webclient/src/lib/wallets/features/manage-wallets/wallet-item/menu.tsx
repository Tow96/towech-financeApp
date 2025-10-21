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

import { WalletDto } from '@/lib/wallets/data-store';
import { EditWalletDialog } from '@/lib/wallets/features/manage-wallets/wallet-item/edit-wallet-dialog';
import { ArchiveWalletDialog } from '@/lib/wallets/features/manage-wallets/wallet-item/archive-wallet-dialog';

interface WalletItemMenuProps {
  wallet: WalletDto;
}

export const WalletItemMenu = ({ wallet }: WalletItemMenuProps): ReactNode => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openArch, setOpenArch] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  return (
    <DropDrawer>
      {/* Forms (hidden at start) */}
      <EditWalletDialog open={openEdit} setOpen={setOpenEdit} wallet={wallet} />
      <ArchiveWalletDialog open={openArch} setOpen={setOpenArch} wallet={wallet} restore={false} />
      <ArchiveWalletDialog open={openRes} setOpen={setOpenRes} wallet={wallet} restore={true} />

      {/* Menu button */}
      <DropDrawerTrigger asChild>
        <Button variant="secondary" size="icon" className="ml-3">
          <Ellipsis />
        </Button>
      </DropDrawerTrigger>

      {/* Menu */}
      {!wallet.archived ? (
        // Regular wallet menu
        <DropDrawerContent align="start">
          <DropDrawerGroup>
            <DropDrawerItem onClick={() => setOpenEdit(true)} icon={<Pencil />}>
              <span>Edit Wallet</span>
            </DropDrawerItem>

            <DropDrawerItem
              onClick={() => setOpenArch(true)}
              icon={<Archive />}
              variant="destructive">
              <span>Archive Wallet</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      ) : (
        // Archived wallet menu
        <DropDrawerContent align="start">
          <DropDrawerGroup>
            <DropDrawerItem onClick={() => setOpenRes(true)} icon={<ArchiveRestore />}>
              <span>Restore Wallet</span>
            </DropDrawerItem>
          </DropDrawerGroup>
        </DropDrawerContent>
      )}
    </DropDrawer>
  );
};
