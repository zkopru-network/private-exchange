import { useCallback, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { pairNameAndBuyOrSell } from '../utils/advertisement'
import AdvertisementEntity from '../db/Advertisement'
import usePeerStore from '../store/peer'
import { useListenSmp } from './smp'
import { useTokensMap } from './tokens'
import { API_ROOT } from '../constants'

export type FormData = {
  currency1: string // currency advertiser pay
  currency2: string // currency advertiser receive
  advertiser: string // advertiser zkopru address
  amount: number // scaled amount to pay
  receiveAmount: number // scaled amount to receive (scale)
}

export type AdvertiseParams = FormData & {
  peerId: string
}

export type Advertisement = {
  id: number
  pair: string
  buyOrSell: boolean
  amount: number
  peerId: string
  advertiser: string
}

export function usePostAdvertisement() {
  return useCallback(
    async ({ currency1, currency2, advertiser, amount, peerId, id }) => {
      const { pairName, buyOrSell } = pairNameAndBuyOrSell(currency1, currency2)
      return await axios.post(`${API_ROOT}/advertisement`, {
        id,
        advertiser,
        pair: pairName,
        buyOrSell,
        amount,
        peerId
      })
    },
    []
  )
}

export function useAdvertisementsQuery() {
  return useQuery<Advertisement[]>(['advertisements'], async () => {
    const res = await axios.get<Advertisement[]>(`${API_ROOT}/advertisements`)
    return res.data
  })
}

export function useAdvertisementQuery(id: string) {
  return useQuery<Advertisement | null>(['advertisement', id], async () => {
    try {
      const res = await axios.get<Advertisement>(
        `${API_ROOT}/advertisement/${id}`
      )
      return res.data
    } catch (e) {
      return null
    }
  })
}

export function useStartLoadExistingAd() {
  const tokensMap = useTokensMap()
  const [loaded, setLoaded] = useState(false)
  const peer = usePeerStore().peer
  const listen = useListenSmp()

  useEffect(() => {
    const loadAds = async () => {
      console.log('load existing ad')
      // wait until client is ready
      const ad = await AdvertisementEntity.findLatest()

      if (ad && !ad.exchanged) {
        if (
          tokensMap.data &&
          tokensMap.data[ad?.currency1] &&
          tokensMap.data[ad?.currency2]
        ) {
          console.log('ads existing. start listening smp')
          listen(ad)
          setLoaded(true)
        }
      } else {
        console.log('ads do not exist.')
        setLoaded(true)
      }
    }

    if (!peer && !loaded && tokensMap.data) {
      loadAds()
    }
  }, [tokensMap])
}
