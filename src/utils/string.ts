export function truncateString(str: string, num: number): string {
  if (str.length <= num) {
    return str
  }

  return str.slice(0, num)
}

export function shortAddressString(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`
}
