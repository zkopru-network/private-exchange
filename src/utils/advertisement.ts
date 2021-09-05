// pair name is a string concatenated two currency names.
export function getPairName(currency1: string, currency2: string): string {
  return `${currency1}/${currency2}`
}
