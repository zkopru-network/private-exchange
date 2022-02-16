import { BigNumber } from 'ethers'
import { useMutation } from 'react-query'
import useStore from '../store/zkopru'

type SwapParams = {
  sendToken: string // token address to send. ETH is Zero address.
  receiveToken: string // token address to receive. ETH is Zero address
  sendAmount: BigNumber
  receiveAmount: BigNumber
  counterParty: string
  salt: number
}

export function useSwap() {
  return useMutation<string | undefined, unknown, SwapParams>(
    async ({
      sendToken,
      sendAmount,
      receiveToken,
      receiveAmount,
      counterParty,
      salt
    }) => {
      console.log('Sending swap transaction...')
      const { zkAddress, wallet } = useStore.getState()
      if (!zkAddress || !wallet)
        throw new Error('zkopru client not initialized')
      const { account } = wallet.wallet
      if (!account) throw new Error('zkAccount not set')

      // const fee = await wallet.loadCurrentPrice()
      const fee = '2060000000000'

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
        const zkTx = await wallet.wallet.shieldTx({ tx })
        await wallet.wallet.sendLayer2Tx(zkTx)
        return zkTx.hash().toString()
      } catch (e) {
        console.error(e)
      }
    }
  )
}
