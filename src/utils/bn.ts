import { BigNumber, BigNumberish } from 'ethers'

export function toUnscaled(
  n: BigNumber,
  decimal: number,
  precision = 6
): number {
  const p = 10 ** precision
  return n.mul(p).div(BigNumber.from(10).pow(decimal)).toNumber() / p
}

export function toScaled(n: BigNumberish, decimal: number): BigNumber {
  // handle decimal
  const str = n.toString()
  if (str.indexOf('.') !== -1) {
    // calc decimal part length
    const decimalLength = str.split('.')[1].length
    const splittedStrs = str.split('.')
    if (decimalLength <= decimal) {
      return BigNumber.from(splittedStrs[0] + splittedStrs[1]).mul(
        pow10(decimal - decimalLength)
      )
    } else {
      return BigNumber.from(splittedStrs[0] + splittedStrs[1].slice(0, decimal))
    }
  }

  return BigNumber.from(n).mul(pow10(decimal))
}

export function pow10(d: number): BigNumber {
  return BigNumber.from(10).pow(d)
}
