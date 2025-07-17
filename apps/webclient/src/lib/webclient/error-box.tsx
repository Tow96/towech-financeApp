import { ReactNode } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import axios from 'axios';

import { Alert, AlertDescription, AlertTitle } from '@/lib/shadcn-ui/components/ui/alert';

interface ErrorBoxProps {
  className?: string;
  title: string;
  error: Error | null;
}

export const ErrorBox = (props: ErrorBoxProps): ReactNode => {
  let message = props.error?.message || '';

  if (axios.isAxiosError(props.error)) {
    message = props.error.response?.data?.message || '';
  }

  return (
    <Alert variant="destructive" className={props.className}>
      <AlertCircleIcon />
      <AlertTitle>{props.title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
