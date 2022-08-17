import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { useMutation } from 'react-query'
import { useZkopru } from './zkopruProvider'

type SwapParams = {
  sendToken: string // token address to send. ETH is Zero address.
  receiveToken: string // token address to receive. ETH is Zero address
  sendAmount: BigNumber
  receiveAmount: BigNumber
  counterParty: string
  fee: number
  salt: number
}

export function useSwap() {
  const { zkopru, account } = useZkopru()
  return useMutation<void, unknown, SwapParams>(
    async ({
      sendToken,
      sendAmount,
      receiveToken,
      receiveAmount,
      counterParty,
      salt,
      fee
    }) => {
      console.log('Sending swap transaction...')
      if (!account || !zkopru) throw new Error('zkopru client not initialized')

      const actualFee = parseUnits(fee.toString(), 'gwei').toString()
      try {
        zkopru.swap(
          sendToken,
          sendAmount.toString(),
          receiveToken,
          receiveAmount.toString(),
          counterParty,
          salt,
          actualFee.toString()
        )
      } catch (e) {
        console.error(e)
      }
    }
  )
}
