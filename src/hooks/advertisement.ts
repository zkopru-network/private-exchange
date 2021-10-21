import { ContractTransaction, providers, BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useMutation, useQuery } from 'react-query'
import { useAddresses } from './addresses'
import { PeekABook__factory } from '../typechain'
import { pairNameAndBuyOrSell } from '../utils/advertisement'
import { TypedEvent } from '../typechain/commons'

type AdvertiseParams = {
  currency1: string
  currency2: string
  amount: number
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
    async ({ currency1, currency2, amount, peerId }) => {
      if (!library) throw new Error('getting provider failed. connect wallet')
      const signer = library.getSigner()
      const contract = PeekABook__factory.connect(addresses.PeekABook, signer)
      const { pairName, buyOrSell } = pairNameAndBuyOrSell(currency1, currency2)

      return await contract.advertise(pairName, buyOrSell, amount, peerId)
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
