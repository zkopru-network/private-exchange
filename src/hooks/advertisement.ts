import { ContractTransaction, providers, BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useMutation, useQuery } from 'react-query'
import { useAddresses } from './addresses'
import { PeekABook__factory } from '../typechain'
import { pairNameAndBuyOrSell } from '../utils/advertisement'
import { TypedEvent } from '../typechain/commons'
import AdvertisementEntity from '../db/Advertisement'
import { useCallback, useEffect } from 'react'
import useZkopruStore from '../store/zkopru'
import usePeerStore from '../store/peer'
import { useListenSmp } from './smp'
import { toScaled } from '../utils/bn'
import { Tokens } from '../constants'

export type FormData = {
  currency1: string
  currency2: string
  amount: number
  receiveAmount: number
}

export type AdvertiseParams = FormData & {
  peerId: string
}

export type Advertisement = {
  adID: BigNumber
  pairIndex: string
  pair: string
  buyOrSell: boolean
  amount: BigNumber
  peerID: string
  advertiser: string
}

export function useAdvertiseMutation() {
  const addresses = useAddresses()
  const { library } = useWeb3React<providers.Web3Provider>()

  return useMutation<ContractTransaction, Error, AdvertiseParams>(
    async ({ currency1, currency2, amount, receiveAmount, peerId }) => {
      if (!library) throw new Error('getting provider failed. connect wallet')
      const signer = library.getSigner()
      const contract = PeekABook__factory.connect(addresses.PeekABook, signer)
      const { pairName, buyOrSell } = pairNameAndBuyOrSell(currency1, currency2)
      const scaledAmount = toScaled(amount, Tokens[currency1].decimals)

      const tx = await contract.advertise(
        pairName,
        buyOrSell,
        scaledAmount,
        peerId
      )
      return tx
    }
  )
}

function parseAdvertisement(
  event: TypedEvent<
    [BigNumber, string, string, boolean, BigNumber, string, string] & {
      adID: BigNumber
      pairIndex: string
      pair: string
      buyOrSell: boolean
      amount: BigNumber
      peerID: string
      advertiser: string
    }
  >
): Advertisement {
  return {
    adID: event.args.adID,
    pairIndex: event.args.pairIndex,
    pair: event.args.pair,
    buyOrSell: event.args.buyOrSell,
    amount: event.args.amount,
    peerID: event.args.peerID,
    advertiser: event.args.advertiser
  }
}

export function useAdvertisementsQuery() {
  const addresses = useAddresses()
  const { library } = useWeb3React<providers.Web3Provider>()

  return useQuery(
    ['advertisements'],
    async () => {
      if (!library) throw new Error('getting provider failed. connect wallet')
      const contract = PeekABook__factory.connect(addresses.PeekABook, library)

      return (await contract.queryFilter(contract.filters.Advertise())).map(
        parseAdvertisement
      )
    },
    {
      enabled: !!library
    }
  )
}

export function useAdvertisementQuery(id: string) {
  const advertisements = useAdvertisementsQuery()

  return advertisements.data
    ? {
        isError: advertisements.isError,
        isLoading: advertisements.isLoading,
        data: advertisements.data.find((ad) => ad.adID.toString() === id)
      }
    : {
        isError: advertisements.isError,
        isLoading: advertisements.isLoading,
        data: null
      }
}

export function useStartLoadExistingAd() {
  const wallet = useZkopruStore().wallet
  const peer = usePeerStore().peer
  const listen = useListenSmp()

  useEffect(() => {
    if (wallet && !peer) {
      ;(async () => {
        console.log('load existing ad')
        // wait until client is ready
        const ad = await AdvertisementEntity.findLatest()

        if (ad && !ad.exchanged) {
          console.log('ads existing. start listening smp')
          listen(ad)
        } else {
          console.log('ads do not exist.')
        }
      })()
    }
  }, [wallet, peer])
}

export function useUpdateAdvertisementMutation() {
  const addresses = useAddresses()
  const { library } = useWeb3React<providers.Web3Provider>()
  const advertise = useAdvertiseMutation()

  return useCallback(
    async ({
      currency1,
      currency2,
      adId,
      amount,
      peerId,
      receiveAmount
    }: AdvertiseParams & { adId: number }) => {
      if (!addresses || !library)
        throw new Error('Cannot call update advertisement')
      const signer = library.getSigner()
      const contract = PeekABook__factory.connect(addresses.PeekABook, signer)

      const invalidateTx = await contract.invalidate(adId)
      await invalidateTx.wait()

      await advertise.mutateAsync({
        currency1,
        currency2,
        amount,
        receiveAmount,
        peerId
      })
    },
    [addresses, library, advertise]
  )
}
