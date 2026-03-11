export * from './logger'
export * from './session'

export function convertAmountToCents(value: string): number {
	const cleanValue = value.replaceAll(',', '')
	const splitValue = cleanValue.split('.')

	return parseInt(`${splitValue[0]}${(splitValue[1] || '').padEnd(2, '0').substring(0, 2)}`)
}

export function getDaysBetweenDates(date1: Date, date2: Date): number {
	const delta = Math.abs(date2.getTime() - date1.getTime())
	return Math.floor(delta / (1000 * 60 * 60 * 24))
}
