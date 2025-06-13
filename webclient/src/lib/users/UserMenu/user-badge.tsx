import { ReactNode } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/lib/shadcn-ui/components/ui/avatar";

interface UserProps {
  name: string;
  email: string;
  avatar: string;
}

export const UserBadge = (props: UserProps): ReactNode => {
  const fallbackName = 'CN';

  return (
    <div className="flex items-center gap-2 text-left text-sm">
      <Avatar className="h-6 w-6 rounded-full">
        <AvatarImage src={props.avatar} alt={props.name} />
        <AvatarFallback className="rounded-lg">{fallbackName}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left text-sm leading-tight flex flex-col">
        <span className="truncate font-medium">{props.name}</span>
        <span className="truncate text-xs">{props.email}</span>
      </div>
    </div>
  );
};
