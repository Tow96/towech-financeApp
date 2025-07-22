export function capitalizeFirst(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export function convertAmountToCurrencyString(value: number): string {
  const prefix = value < 0 ? '-$' : '$';
  return `${prefix}  ${Math.abs(value / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
