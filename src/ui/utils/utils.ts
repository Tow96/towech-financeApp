import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs))
}

export function capitalizeFirst(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

export function convertCentsToAmount(value: number): string {
	return Math.abs(value / 100).toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}

export function convertCentsToCurrencyString(value: number): string {
	const prefix = value < 0 ? '-$' : '$'
	return `${prefix}${convertCentsToAmount(value)}`
}

/** Converts a given cent count to a string in "letter notation" with up to 2 decimal places
 *
 * Examples
 *
 * 1,000,000.43 => 1M
 *
 * 1,245,000.24 => 1.25M
 *
 *
 * 753,225.00 => 753K
 */
export const formatNumberToLetterNotation = (cents: number, deltaCents: number) => {
	const money = Math.floor(cents / 100)
	const delta = Math.abs(deltaCents / 100)

	if (Math.abs(money) >= 1_000_000 && (delta > 10_000 || delta === 0)) {
		const millions = money / 1_000_000
		return millions > 100
			? `${millions.toFixed(0)}M`
			: `${Math.round((millions + Number.EPSILON) * 100) / 100}M` // its okay to use epsilon, we don't need exact values
	}

	if (Math.abs(money) >= 1_000 && delta > 10) {
		const thousands = money / 1_000

		if (thousands < 1000) {
			// its okay to use epsilon, we don't need exact values
			return thousands > 100
				? `${Math.round(thousands).toLocaleString()}K`
				: `${(Math.round((thousands + Number.EPSILON) * 100) / 100).toLocaleString()}K`
		}
	}

	return money.toLocaleString()
}
