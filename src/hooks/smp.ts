import { useCallback } from 'react'
import { useMutation } from 'react-query'
import SMPPeer from 'js-smp-peer2'
import toast from 'react-hot-toast'
import useStore from '../store/zkopru'
import usePeerStore, { PEER_STATUS } from '../store/peer'
import { useSwap } from './swap'
import { useUpdateAdvertisementMutation, FormData } from './advertisement'
import { peerConfig, Tokens } from '../constants'
import { pow10, toScaled, toUnscaled } from '../utils/bn'
import AdvertisementEntity from '../db/Advertisement'

type SMPParams = {
  price: string
  counterpartyId: string
  // receive amount to use amount negotiation
  amount: number
}

type SmpResult = {
  result: boolean
  negotiatedAmount: number
}

export function useRunSmp() {
  return useMutation<SmpResult, unknown, SMPParams>(
    async ({ price, counterpartyId, amount }) => {
      const { zkAddress } = useStore.getState()
      if (!zkAddress) throw new Error('zkopru client not initialized')

      const peerId = zkAddress.toString()
      const peer = new SMPPeer(price, amount, peerId, peerConfig)
      await peer.connectToPeerServer()

      const result = await peer.runSMP(counterpartyId)

      console.log(
        `Finish running SMP with peer: ${counterpartyId}, result=${result}`
      )

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

  const listen = useCallback(async (data: ListenParams) => {
    const peerId = useStore.getState().zkAddress as string
    const sendDecimals = Tokens[data.currency1].decimals
    const receiveDecimals = Tokens[data.currency2].decimals
    const scaledAmount = toScaled(data.amount, sendDecimals)
    const scaledReceiveAmount = toScaled(data.receiveAmount, receiveDecimals)

    // initialize SMPPeer and set peer to store
    const price = scaledReceiveAmount
      .mul(pow10(Tokens[data.currency1].decimals))
      .div(scaledAmount)
    store.setPeerStatus(PEER_STATUS.STARTING)
    const peer = new SMPPeer(price.toString(), data.amount, peerId, peerConfig)
    await peer.connectToPeerServer()
    store.setPeer(peer)
    peer.on(
      'incoming',
      async (
        remotePeerId: string,
        result: boolean,
        negotiatedAmount: number
      ) => {
        toast(
          `Incoming SMP finished. result: ${
            result ? 'Success' : 'Failed'
          }, negotiatedAmount: ${negotiatedAmount}`
        )

        // TODO: get remote peer zkAddress. when implement blind find
        if (result) {
          const send = toScaled(
            negotiatedAmount,
            Tokens[data.currency1].decimals
          )
          const receive = price
            .mul(send)
            .div(pow10(Tokens[data.currency1].decimals))
          toast(
            `Creating swap transaction. send ${
              data.currency1
            }: ${send.toString()}, receive ${
              data.currency2
            }: ${receive.toString()}`
          )
          try {
            await swapMutation.mutateAsync({
              counterParty: remotePeerId,
              sendToken: Tokens[data.currency1].address,
              receiveToken: Tokens[data.currency2].address,
              receiveAmount: receive,
              sendAmount: send
            })
            toast.success('Successfully create swap transaction.')
            peer.disconnect()
            store.setPeer(null)
            store.setPeerStatus(PEER_STATUS.OFF)
            // TODO: save history match maked

            // rest amount: data.amount - send
            // update ads on-chain using this send amount
            const newAd = {
              ...data,
              amount: toUnscaled(scaledAmount.sub(send), sendDecimals),
              receiveAmount: toUnscaled(
                scaledReceiveAmount.sub(receive),
                receiveDecimals
              ),
              peerId,
              exchanged: false
            }

            await updateAdvertisement(newAd)
            await AdvertisementEntity.delete(data.adId)

            if (newAd.amount > 0) {
              await AdvertisementEntity.save(newAd)
              // restart peer if needed.
              listen(newAd)
            }
          } catch (e) {
            toast.error('Creating swap transaction failed.')
          }
        }
      }
    )
    store.setPeerStatus(PEER_STATUS.RUNNING)
  }, [])

  return listen
}
