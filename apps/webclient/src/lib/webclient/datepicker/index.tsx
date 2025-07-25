'use client';
import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/lib/shadcn-ui/components/ui/popover';
import { FormControl } from '@/lib/shadcn-ui/components/ui/form';
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(props.value || undefined);

  const handleOnChange = (value: Date | undefined) => {
    setSelectedDate(value);
    if (props.onChange) props.onChange(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(!selectedDate && 'text-muted-foreground')}
          disabled={props.disabled}>
          {selectedDate ? selectedDate.toLocaleDateString() : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={selectedDate || new Date()}
          selected={selectedDate || new Date()}
          onSelect={handleOnChange}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
};
