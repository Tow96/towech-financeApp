import { useState } from 'react'
import { ArrowBigLeft, ArrowBigRight, CalendarIcon } from 'lucide-react'

import { Button, MonthPicker, Popover, PopoverContent, PopoverTrigger } from '@/ui/components'
import { cn } from '@/ui/utils'

interface PeriodSelectorProps {
	className?: string
	value?: Date
	onChange?: (v: Date) => void
	disabled?: boolean
}

export const PeriodSelector = (props: PeriodSelectorProps) => {
	const [internalValue, setInternalValue] = useState<Date>(props.value ?? new Date())

	const handleValueChange = (v: Date) => {
		setInternalValue(v)
		if (props.onChange) props.onChange(v)
	}

	const changeMonth = (delta: number) => {
		const currDate = new Date(internalValue)
		currDate.setMonth(currDate.getMonth() + delta)
		handleValueChange(currDate)
	}

	return (
		<div className={props.className}>
			<div className="flex">
				<Button disabled={props.disabled} size="icon" onClick={() => changeMonth(-1)}>
					<ArrowBigLeft />
				</Button>

				{/* Month selector */}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							disabled={props.disabled}
							variant={'outline'}
							className={cn('flex-1 font-normal')}>
							{(internalValue.getMonth() + 1).toString().padStart(2, '0')} /{' '}
							{internalValue.getFullYear()}
							<CalendarIcon className="mr-2 h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<MonthPicker onMonthSelect={handleValueChange} selectedMonth={internalValue} />
					</PopoverContent>
				</Popover>

				<Button disabled={props.disabled} size="icon" onClick={() => changeMonth(1)}>
					<ArrowBigRight />
				</Button>
			</div>
		</div>
	)
}
