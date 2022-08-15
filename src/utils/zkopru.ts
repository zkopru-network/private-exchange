declare global {
  interface Window {
    zkopru?: ZkopruProvider
  }
}

export type TokenBalances = {
  [key: string]: number
}

export type L2Balance = {
  eth: number
  tokenBalances: TokenBalances
  lockedTokenBalances: TokenBalances
}

export declare class ZkopruProvider {
  constructor()
  get connected(): boolean
  connect(): void
  getBalance(): Promise<L2Balance>
  getAddress(): Promise<string>
  transferEth(to: string, amount: string): Promise<string>
  transferERC20(to: string, token: string, amount: string): Promise<string>
  swap(
    sendToken: string,
    sendAmount: string,
    receiveToken: string,
    receiveAmount: string,
    counterParty: string,
    salt: number,
    fee: string
  ): Promise<void>
  getBlockNumber(): Promise<void>
}

/**
 * detect zkopru provider within ginven timeout
 * @returns if zkopru extension is installed in browser, returns it, otherwise returns undefined
 */
export default async function detectZkopru(
  timeout = 3000
): Promise<ZkopruProvider | null> {
  let resolved = false

  return new Promise((resolve, reject) => {
    const handleProvider = () => {
      if (window.zkopru && !resolved) {
        resolved = true
        window.removeEventListener('ZKOPRU#SET_PROVIDER', handleProvider)
        resolve(window.zkopru)
      } else {
        resolve(null)
      }
    }

    if (window.zkopru) {
      handleProvider()
    } else {
      // add event lisetener
      window.addEventListener('ZKOPRU#SET_PROVIDER', handleProvider, {
        once: true
      })

      setTimeout(handleProvider, timeout)
    }
  })
}
