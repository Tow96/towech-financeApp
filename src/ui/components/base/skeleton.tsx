import * as React from 'react'
import { cn } from '@/ui/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="skeleton"
			className={cn('bg-accent animate-pulse rounded-md', className)}
			{...props}
		/>
	)
}

export { Skeleton }
