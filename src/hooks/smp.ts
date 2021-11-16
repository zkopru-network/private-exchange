import { useCallback } from 'react'
import { useMutation } from 'react-query'
import SMPPeer from 'js-smp-peer'
import toast from 'react-hot-toast'
import useStore from '../store/zkopru'
import usePeerStore, { PEER_STATUS } from '../store/peer'
import { useSwap } from './swap'
import { useUpdateAdvertisementMutation, FormData } from './advertisement'
import { peerConfig, Tokens } from '../constants'
import { pow10, toScaled } from '../utils/bn'

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

type ListenParams = FormData & {
  adId: number
}

export function useListenSmp() {
  const store = usePeerStore()
  const swapMutation = useSwap()
  const updateAdvertisement = useUpdateAdvertisementMutation()

  return useCallback(async (data: ListenParams) => {
    const peerId = useStore.getState().zkAddress as string
    const scaledAmount = toScaled(data.amount, Tokens[data.currency1].decimals)
    const scaledReceiveAmount = toScaled(
      data.receiveAmount,
      Tokens[data.currency2].decimals
    )

    // initialize SMPPeer and set peer to store
    const price = scaledReceiveAmount
      .mul(pow10(Tokens[data.currency1].decimals))
      .div(scaledAmount)
    store.setPeerStatus(PEER_STATUS.STARTING)
    const peer = new SMPPeer(price.toString(), peerId, peerConfig)
    await peer.connectToPeerServer()
    store.setPeer(peer)
    peer.on('incoming', async (remotePeerId: string, result: boolean) => {
      toast(`Incoming SMP finished. result: ${result ? 'Success' : 'Failed'}.`)

      // TODO: get remote peer zkAddress. when implement blind find
      if (result) {
        toast('Creating swap transaction')
        try {
          await swapMutation.mutateAsync({
            counterParty: remotePeerId,
            sendToken: Tokens[data.currency1].address,
            receiveToken: Tokens[data.currency2].address,
            receiveAmount: scaledReceiveAmount,
            sendAmount: scaledAmount
          })
          toast.success('Successfully create swap transaction.')

          const newAd = {
            ...data,
            exchanged: true
          }
          await updateAdvertisement(newAd)
          peer.disconnect()
          store.setPeer(null)
          store.setPeerStatus(PEER_STATUS.OFF)
        } catch (e) {
          toast.error('Creating swap transaction failed.')
        }
      }
    })
    store.setPeerStatus(PEER_STATUS.RUNNING)
  }, [])
}
