import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs))
}

export function capitalizeFirst(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

export function convertAmountToCents(value: string): number {
	const cleanValue = value.replaceAll(',', '')
	const splitValue = cleanValue.split('.')

	return parseInt(`${splitValue[0]}${((splitValue[1] || '').padEnd(2, '0')).substring(0, 2)}`)
}

export function convertCentsToAmount(value: number): string {
	return Math.abs(value / 100).toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}

export function convertCentsToCurrencyString(value: number): string {
	const prefix = value < 0 ? '-$' : '$'
	return `${prefix}  ${convertCentsToAmount(value)}`
}
