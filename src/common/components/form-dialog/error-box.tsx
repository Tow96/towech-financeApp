import { AlertCircleIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert'

interface ErrorBoxProps {
	className?: string
	title: string
	error: Error | null
}
export const ErrorBox = (props: ErrorBoxProps) => {
	const message = props.error?.message || ''

	return (
		<Alert variant="destructive" className={props.className}>
			<AlertCircleIcon />
			<AlertTitle>{props.title}</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}
