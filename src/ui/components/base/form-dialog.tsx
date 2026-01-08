import { AlertCircleIcon, Loader2Icon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from './alert'
import { Button } from './button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './dialog'
import { Form } from './form'

import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'

interface FormDialogProps {
	open: boolean
	setOpen: (open: boolean) => void
	title: string
	children: ReactNode
	form: UseFormReturn<any>
	onSubmit: (v: any) => void
	error: Error | null
	loading: boolean
}
export const FormDialog = (props: FormDialogProps) => {
	return (
		<Dialog open={props.open} onOpenChange={props.setOpen}>
			<DialogContent>
				<DialogDescription className="sr-only">Dialog for the {props.title} form</DialogDescription>
				<DialogHeader>
					<DialogTitle>{props.title}</DialogTitle>
				</DialogHeader>

				<Form {...props.form}>
					<form onSubmit={props.form.handleSubmit(props.onSubmit)}>
						{/* Form content */}
						{props.children}

						{/* Error box */}
						{props.error !== null && (
							<ErrorBox className="mb-4" title="Error" error={props.error} />
						)}

						{/* Form close */}
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" disabled={props.loading}>
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={props.loading}>
								{props.loading && <Loader2Icon className="animate-spin" />}
								Confirm
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

interface ErrorBoxProps {
	className?: string
	title: string
	error: Error | null
}
const ErrorBox = (props: ErrorBoxProps) => {
	const message = props.error?.message || ''

	return (
		<Alert variant="destructive" className={props.className}>
			<AlertCircleIcon />
			<AlertTitle>{props.title}</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}
