import { CalendarIcon } from 'lucide-react'

import { Button } from '@/common/components/ui/button'
import { Calendar } from '@/common/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'
import { cn } from '@/common/lib/utils'

interface DatepickerProps {
	className?: string
	value?: Date
	onChange: (d: Date) => void
	disabled?: boolean
}

export const Datepicker = (props: DatepickerProps) => {
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
					required={true}
					defaultMonth={props.value}
					startMonth={new Date(2015, 0)}
					selected={props.value}
					onSelect={props.onChange}
					captionLayout="dropdown"
				/>
			</PopoverContent>
		</Popover>
	)
}
