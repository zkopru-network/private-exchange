import { ContractTransaction, providers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useMutation } from 'react-query'
import { useAddresses } from './addresses'
import { PeekABook__factory } from '../typechain'
import { pairNameAndBuyOrSell } from '../utils/advertisement'

type AdvertiseParams = {
  currency1: string
  currency2: string
  amount: number
}

export function useAdvertiseMutation() {
  const addresses = useAddresses()
  const { library } = useWeb3React<providers.Web3Provider>()

  return useMutation<ContractTransaction, Error, AdvertiseParams>(
    async ({ currency1, currency2, amount }) => {
      if (!library) throw new Error('getting provider failed. connect wallet')
      const signer = library.getSigner()
      const contract = PeekABook__factory.connect(addresses.PeekABook, signer)
      const { pairName, buyOrSell } = pairNameAndBuyOrSell(currency1, currency2)
      const peerId = 'id' // todo: get peerId from hook

      return await contract.advertise(pairName, buyOrSell, amount, peerId)
    }
  )
}
