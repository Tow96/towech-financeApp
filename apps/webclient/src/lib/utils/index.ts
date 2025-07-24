export function capitalizeFirst(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export function convertCentsToCurrencyString(value: number): string {
  const prefix = value < 0 ? '-$' : '$';
  return `${prefix}  ${Math.abs(value / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function convertValueToCents(value: number): number {
  return Math.round(value * 100);
}
