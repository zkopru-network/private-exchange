import { useMutation } from 'react-query'
import SMPPeer from 'js-smp-peer'
import useStore from '../store/zkopru'
import { peerConfig } from '../constants'

type SMPParams = {
  price: string
  counterpartyId: string
}

export function useSmp() {
  return useMutation<boolean, unknown, SMPParams>(
    async ({ price, counterpartyId }) => {
      const { zkAddress } = useStore.getState()
      if (!zkAddress) throw new Error('zkopru client not initialized')

      // const peerId = getOrGeneratePeerId()
      const peerId = zkAddress.toString()
      const peer = new SMPPeer(price, peerId, peerConfig)
      await peer.connectToPeerServer()

      const result = await peer.runSMP(counterpartyId)

      console.log(
        `Finish running SMP with peer: ${counterpartyId}, result=${result}`
      )

      if (!result) return false

      // create atomic swap tx and send
      return result
    }
  )
}
