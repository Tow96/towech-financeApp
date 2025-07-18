export function capitalizeFirst(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export function convertNumToCurrencyString(value: number): string {
  const prefix = value < 0 ? '-$' : '$';
  return `${prefix}  ${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
