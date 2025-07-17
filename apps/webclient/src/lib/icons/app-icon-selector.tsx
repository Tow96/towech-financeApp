'use client';
import { ReactNode, useState } from 'react';
import { useController, Control } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/lib/shadcn-ui/components/ui/dialog';

import { AppIcon } from './app-icon';

const MAX_ICON_ID = 35;
const icons: ReactNode[] = [];
for (let i = 0; i < MAX_ICON_ID; i++) {
  icons.push(<AppIcon className="rounded-full w-18 h-18" id={i} name="C" />);
}

interface AppIconSelectorProps {
  control?: Control;
  name?: string;
  disabled?: boolean;
}

export const AppIconSelector = (props: AppIconSelectorProps): ReactNode => {
  const {
    field: { onChange, value },
  } = useController({ name: props.name || '', control: props.control });

  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<number>(value || 0);

  const handleOnChange = (icon: number) => {
    setSelectedIcon(icon);
    onChange(icon);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button disabled={props.disabled} className="disabled:opacity-50 disabled:pointer-events-none">
          <AppIcon className="rounded-full w-24 h-24" id={selectedIcon} name="C" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogDescription className="sr-only">IconSelector</DialogDescription>
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
        </DialogHeader>

        <div className="gap-5 flex max-h-96 justify-center overflow-y-scroll flex-wrap">
          {icons.map((icon, i) => (
            <button key={i} onClick={() => handleOnChange(i)}>
              {icon}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
