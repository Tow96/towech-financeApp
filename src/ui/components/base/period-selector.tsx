import { ArrowBigLeft, ArrowBigRight, CalendarIcon } from 'lucide-react'

import { Button, MonthPicker, Popover, PopoverContent, PopoverTrigger } from '@/ui/components'
import { cn } from '@/ui/utils'

// TODO: Remove state drilling
interface PeriodSelectorProps {
	start: Date
	setStart: (start: Date) => void
}

export const PeriodSelector = (props: PeriodSelectorProps) => {
	const changeMonth = (delta: number) => {
		const currDate = new Date(props.start)
		currDate.setMonth(currDate.getMonth() + delta)
		props.setStart(currDate)
	}

	return (
		<div className="flex">
			<Button size="icon" onClick={() => changeMonth(-1)}>
				<ArrowBigLeft />
			</Button>

			{/* Month selector */}
			<Popover>
				<PopoverTrigger asChild>
					<Button variant={'outline'} className={cn('justify-start text-left font-normal')}>
						{(props.start.getMonth() + 1).toString().padStart(2, '0')} / {props.start.getFullYear()}
						<CalendarIcon className="mr-2 h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<MonthPicker onMonthSelect={props.setStart} selectedMonth={props.start} />
				</PopoverContent>
			</Popover>

			<Button size="icon" onClick={() => changeMonth(1)}>
				<ArrowBigRight />
			</Button>
		</div>
	)
}
