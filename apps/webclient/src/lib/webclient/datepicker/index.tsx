'use client';
import { CalendarIcon } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shadcn-ui/components/ui/popover';
import { Button } from '@/lib/shadcn-ui/components/ui/button';
import { Calendar } from '@/lib/shadcn-ui/components/ui/calendar';
import { cn } from '@/lib/shadcn-ui/utils';

interface DatePickerProps {
  className?: string;
  value?: Date;
  onChange?: (e?: Date) => void;
  disabled?: boolean;
}

export const DatePicker = (props: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(!props.value && 'text-muted-foreground')}
          disabled={props.disabled}>
          {props.value ? props.value.toLocaleDateString() : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={props.value}
          startMonth={new Date(2015, 0)}
          selected={props.value}
          onSelect={props.onChange}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
};
