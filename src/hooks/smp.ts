import { useCallback } from 'react'
import { useMutation } from 'react-query'
import SMPPeer from 'js-smp-peer2'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { useZkopru } from './zkopruProvider'
import usePeerStore, { PEER_STATUS } from '../store/peer'
import { useSwap } from './swap'
import { FormData, usePostAdvertisement } from './advertisement'
import { usePostPeerInfo } from './peer'
import { peerConfig } from '../constants'
import { pow10, toScaled, toUnscaled } from '../utils/bn'
import AdvertisementEntity from '../db/Advertisement'
import HistoryEntity, { HistoryType } from '../db/History'
import { useTokensMap } from './tokens'

type SMPParams = {
  price: string
  counterpartyId: string
  // receive amount to use amount negotiation
  amount: number
}

type SmpResult = {
  result: boolean
  negotiatedAmount: number
  salt: number
}

export function useRunSmp() {
  const peerId = useZkopru().account
  return useMutation<SmpResult, unknown, SMPParams>(
    async ({ price, counterpartyId, amount }) => {
      if (!peerId) throw new Error('zkopru client not initialized')

      const peer = new SMPPeer(price, amount, peerId, peerConfig)
      await peer.connectToPeerServer()

      return await peer.runSMP(counterpartyId)
    }
  )
}

type ListenParams = FormData & {
  id: number
}

export function useListenSmp() {
  const store = usePeerStore()
  const swapMutation = useSwap()
  const updateAdvertisement = usePostAdvertisement()
  const postPeerInfo = usePostPeerInfo()
  const tokensMapQuery = useTokensMap()
  const { account } = useZkopru()

  const listen = useCallback(
    async (data: ListenParams) => {
      const tokens = tokensMapQuery.data
      if (!account) throw new Error('Zkopru provider not loaded')
      if (!tokens) throw new Error('tokens not loaded')
      if (!tokens[data.currency1] || !tokens[data.currency2])
        throw new Error('Invalid token selected.')
      const peerId = account
      const sendDecimals = tokens[data.currency1].decimals
      const receiveDecimals = tokens[data.currency2].decimals
      const scaledAmount = toScaled(data.amount, sendDecimals)
      const scaledReceiveAmount = toScaled(data.receiveAmount, receiveDecimals)

      // save peer info to database
      // set online
      await postPeerInfo(peerId, true)

      // initialize SMPPeer and set peer to store
      const price = scaledReceiveAmount
        .mul(pow10(sendDecimals))
        .div(scaledAmount)
      store.setPeerStatus(PEER_STATUS.STARTING)
      const peer = new SMPPeer(
        price.toString(),
        data.amount,
        peerId,
        peerConfig
      )
      await peer.connectToPeerServer()
      store.setPeer(peer)
      peer.on(
        'incoming',
        async (
          remotePeerId: string,
          result: boolean,
          negotiatedAmount: number,
          salt: number
        ) => {
          toast(
            `Incoming SMP finished. result: ${
              result ? 'Success' : 'Failed'
            }, negotiatedAmount: ${negotiatedAmount}, salt: ${salt}`
          )

          // TODO: get remote peer zkAddress. when implement blind find
          if (result) {
            const send = toScaled(negotiatedAmount, sendDecimals)
            const receive = price.mul(send).div(pow10(sendDecimals))
            toast(
              `Creating swap transaction. send ${
                data.currency1
              }: ${send.toString()}, receive ${
                data.currency2
              }: ${receive.toString()}`
            )
            // confirm
            try {
              await swapMutation.mutateAsync({
                counterParty: remotePeerId,
                sendToken: tokens[data.currency1].address,
                receiveToken: tokens[data.currency2].address,
                receiveAmount: receive,
                sendAmount: send,
                fee: data.fee,
                salt
              })
              toast.success('Successfully create swap transaction.')
              peer.disconnect()
              store.setPeer(null)
              store.setPeerStatus(PEER_STATUS.OFF)

              await HistoryEntity.save({
                ...data,
                id: undefined,
                historyType: HistoryType.MatchMade,
                timestamp: dayjs().unix(),
                adId: data.id,
                amount: toUnscaled(send, sendDecimals),
                receiveAmount: toUnscaled(receive, receiveDecimals),
                pending: true
              })

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
              await AdvertisementEntity.delete(data.id)

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
    },
    [tokensMapQuery.data]
  )

  return listen
}
