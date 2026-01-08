import { useState } from 'react'
import { useController } from 'react-hook-form'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './dialog'
import { Icon } from './icon'

import type { ReactNode } from 'react'
import type { Control } from 'react-hook-form'

const MAX_ICON_ID = 35
const icons: Array<ReactNode> = []
for (let i = 0; i < MAX_ICON_ID; i++) {
	icons.push(<Icon className="h-18 w-18 rounded-full" id={i} name="C" />)
}

interface IconSelectorProps {
	control?: Control
	name?: string
	disabled?: boolean
	value?: number
}

export const IconSelector = (props: IconSelectorProps) => {
	const {
		field: { onChange, value },
	} = useController({ name: props.name || '', control: props.control })

	const [open, setOpen] = useState(false)
	const [selectedIcon, setSelectedIcon] = useState<number>(props.value ? props.value : value || 0)

	const handleOnChange = (icon: number) => {
		setSelectedIcon(icon)
		onChange(icon)
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				disabled={props.disabled}
				className="disabled:pointer-events-none disabled:opacity-50">
				<Icon className="h-24 w-24 rounded-full" id={selectedIcon} name="C" />
			</DialogTrigger>

			<DialogContent>
				<DialogDescription className="sr-only">Icon Selector</DialogDescription>
				<DialogHeader>
					<DialogTitle>Select an Icon</DialogTitle>
				</DialogHeader>

				<div className="flex max-h-96 flex-wrap justify-center gap-5 overflow-y-scroll">
					{icons.map((icon, i) => (
						<button key={i} onClick={() => handleOnChange(i)}>
							{icon}
						</button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}
