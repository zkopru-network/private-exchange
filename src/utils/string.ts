export function truncateString(str: string, num: number): string {
  if (str.length <= num) {
    return str
  }

  return str.slice(0, num)
}

export function shortAddressString(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`
}

export function trimLeadingZeroesHex(hex: string): string {
  const numPart = hex.substring(2)
  const match = numPart.match(/^0+/)
  const leadingZeroes = match ? match[0].length : 0

  return `0x${numPart.substring(leadingZeroes)}`
}

export function padAddress(hex: string): string {
  const numPart = hex.substring(2)
  return `0x${numPart.padStart(40, '0')}`
}
