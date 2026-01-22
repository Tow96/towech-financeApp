import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from './button'
import { ButtonGroup } from './button-group'
import { Datepicker } from './datepicker'

import { cn } from '@/ui/utils'

enum PeriodMode {
	'Day',
	'Week',
	'Month',
	'Year',
	'Custom',
}

interface PeriodSelectorValue {
	start: Date
	end: Date
}

interface PeriodSelectorProps {
	className?: string
	value?: PeriodSelectorValue
	onChange?: (v: PeriodSelectorValue) => void
	disabled?: boolean
}

export const PeriodSelector = (props: PeriodSelectorProps) => {
	const [showCustom, setShowCustom] = useState<boolean>(false)
	const [periodMode, setPeriodMode] = useState<PeriodMode>(PeriodMode.Day)

	const [internalValue, setInternalValue] = useState<PeriodSelectorValue>(
		props.value ?? {
			start: new Date(new Date().setHours(0, 0, 0, 0)),
			end: new Date(new Date().setHours(23, 59, 59, 999)),
		},
	)

	const handleValueChange = (v: PeriodSelectorValue) => {
		setInternalValue(v)
		if (props.onChange) props.onChange(v)
	}

	const setMode = (period: PeriodMode) => {
		setPeriodMode(period)
		setShowCustom(period === PeriodMode.Custom)

		const newValue: PeriodSelectorValue = {
			start: new Date(),
			end: new Date(),
		}

		switch (period) {
			case PeriodMode.Week:
				newValue.start.setDate(newValue.start.getDate() - newValue.start.getDay())
				newValue.end.setDate(newValue.end.getDate() + 6 - newValue.end.getDay())
				break
			case PeriodMode.Month:
				newValue.start.setDate(1)
				newValue.end.setMonth(newValue.end.getMonth() + 1)
				newValue.end.setDate(0)
				break
			case PeriodMode.Year:
				newValue.start.setMonth(0)
				newValue.start.setDate(1)
				newValue.end.setMonth(11)
				newValue.end.setDate(31)
				break
			case PeriodMode.Custom:
				newValue.start = internalValue.start
				newValue.end = internalValue.end
				break
		}

		newValue.start.setHours(0, 0, 0, 0)
		newValue.end.setHours(23, 59, 59, 999)
		handleValueChange(newValue)
	}

	const changePeriod = (dir: number) => {
		const delta = internalValue.end.getTime() - internalValue.start.getTime() + 1
		const newValue: PeriodSelectorValue = {
			start: new Date(internalValue.start.setTime(internalValue.start.getTime() + dir * delta)),
			end: new Date(internalValue.end.setTime(internalValue.end.getTime() + dir * delta)),
		}
		handleValueChange(newValue)
	}

	const setPartialValue = (s: 'start' | 'end', v: Date) => {
		const newValue: PeriodSelectorValue = {
			start: s === 'start' ? v : internalValue.start,
			end: s === 'end' ? v : internalValue.end,
		}
		handleValueChange(newValue)
	}

	return (
		<div className={cn('m-10', props.className)}>
			<ButtonGroup className={cn('w-full', showCustom && '*:rounded-b-none')}>
				<Button
					disabled={props.disabled}
					className="flex-1"
					variant={PeriodMode.Day === periodMode ? 'default' : 'outline'}
					onClick={() => setMode(PeriodMode.Day)}>
					Today
				</Button>
				<Button
					disabled={props.disabled}
					className="flex-1"
					variant={PeriodMode.Week === periodMode ? 'default' : 'outline'}
					onClick={() => setMode(PeriodMode.Week)}>
					This Week
				</Button>
				<Button
					disabled={props.disabled}
					className="flex-1"
					variant={PeriodMode.Month === periodMode ? 'default' : 'outline'}
					onClick={() => setMode(PeriodMode.Month)}>
					This Month
				</Button>
				<Button
					disabled={props.disabled}
					className="flex-1"
					variant={PeriodMode.Year === periodMode ? 'default' : 'outline'}
					onClick={() => setMode(PeriodMode.Year)}>
					This Year
				</Button>
				<Button
					disabled={props.disabled}
					className="flex-1"
					variant={PeriodMode.Custom === periodMode ? 'default' : 'outline'}
					onClick={() => setMode(PeriodMode.Custom)}>
					Custom <ChevronDown />
				</Button>
			</ButtonGroup>

			{showCustom && (
				<ButtonGroup className="w-full *:rounded-t-none *:border-t-0">
					<Button
						disabled={props.disabled}
						variant="outline"
						size="icon"
						onClick={() => changePeriod(-1)}>
						<ArrowLeft />
					</Button>
					<Datepicker
						disabled={props.disabled}
						className="flex-1"
						value={internalValue.start}
						onChange={v => setPartialValue('start', v)}
					/>
					<Button disabled={props.disabled} variant="outline">
						-
					</Button>
					<Datepicker
						disabled={props.disabled}
						className="flex-1"
						value={internalValue.end}
						onChange={v => setPartialValue('end', v)}
					/>
					<Button
						disabled={props.disabled}
						variant="outline"
						size="icon"
						onClick={() => changePeriod(1)}>
						<ArrowRight />
					</Button>
				</ButtonGroup>
			)}
		</div>
	)
}

