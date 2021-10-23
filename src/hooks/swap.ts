import { BigNumber } from 'ethers'
import { useMutation } from 'react-query'
import { randomHex } from 'web3-utils'
import useStore from '../store/zkopru'

type SwapParams = {
  sendToken: string // token address to send. ETH is Zero address.
  receiveToken: string // token address to receive. ETH is Zero address
  sendAmount: BigNumber
  receiveAmount: BigNumber
  counterParty: string
}

export function useSwap() {
  return useMutation<unknown, unknown, SwapParams>(
    async ({
      sendToken,
      sendAmount,
      receiveToken,
      receiveAmount,
      counterParty
    }) => {
      console.log('Sending swap transaction...')
      const { zkAddress, wallet } = useStore.getState()
      if (!zkAddress || !wallet)
        throw new Error('zkopru client not initialized')
      const { account } = wallet.wallet
      if (!account) throw new Error('zkAccount not set')

      // TODO: set fee from input
      const fee = '10000000000000000'
      // check how it works.
      const salt = randomHex(16)

      try {
        const tx = await wallet.generateSwapTransaction(
          counterParty,
          sendToken,
          sendAmount.toString(),
          receiveToken,
          receiveAmount.toString(),
          fee,
          salt
        )

        wallet.wallet.sendTx({ tx, from: account })
      } catch (e) {
        console.error(e)
      }
      console.log('Finish sending swap transaction...')
    }
  )
}
