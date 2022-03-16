import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { useMutation } from 'react-query'
import useStore from '../store/zkopru'

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
  return useMutation<string | undefined, unknown, SwapParams>(
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
      const { zkAddress, wallet } = useStore.getState()
      if (!zkAddress || !wallet)
        throw new Error('zkopru client not initialized')
      const { account } = wallet.wallet
      if (!account) throw new Error('zkAccount not set')

      const actualFee = parseUnits(fee.toString(), 'gwei').toString()

      try {
        const tx = await wallet.generateSwapTransaction(
          counterParty,
          sendToken,
          sendAmount.toString(),
          receiveToken,
          receiveAmount.toString(),
          actualFee,
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
