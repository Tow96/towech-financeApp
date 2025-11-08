export function capitalizeFirst(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1)
}

export function convertValueToCents(value: number): number {
	return Math.round(value * 100)
}
