// pair name is a string concatenated two currency names.
export function getPairName(currency1: string, currency2: string): string {
  return `${currency1}/${currency2}`
}

export function pairNameAndBuyOrSell(
  currency1: string,
  currency2: string
): {
  pairName: string
  buyOrSell: boolean
} {
  if (currency1 < currency2) {
    return { pairName: getPairName(currency1, currency2), buyOrSell: true }
  } else {
    return { pairName: getPairName(currency2, currency1), buyOrSell: false }
  }
}
