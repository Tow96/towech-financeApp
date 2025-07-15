import { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/shadcn-ui/components/ui/avatar';

interface AppIconProps {
  className?: string;
  id: number;
  name: string;
}

export const AppIcon = (props: AppIconProps): ReactNode => (
  <div>
    <Avatar className={props.className}>
      <AvatarImage src={props.id.toString()} alt={props.name} />
      <AvatarFallback>{props.name.charAt(0)}</AvatarFallback>
    </Avatar>
  </div>
);

export const AppIconSelector = (): ReactNode => (
  <div>
    <Avatar className="rounded-full w-24 h-24">
      <AvatarImage src="https://avatar.iran.liara.run/public" alt="Placeholder" />
      <AvatarFallback>C</AvatarFallback>
    </Avatar>
  </div>
);
