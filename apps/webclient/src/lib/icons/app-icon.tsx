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
      <AvatarImage src={`/icon/${props.id}.svg`} alt={props.name} />
      <AvatarFallback>{props.name.charAt(0)}</AvatarFallback>
    </Avatar>
  </div>
);