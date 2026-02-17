export * from './logger'
export * from './session'

export function convertAmountToCents(value: string): number {
	const cleanValue = value.replaceAll(',', '')
	const splitValue = cleanValue.split('.')

	return parseInt(`${splitValue[0]}${(splitValue[1] || '').padEnd(2, '0').substring(0, 2)}`)
}
