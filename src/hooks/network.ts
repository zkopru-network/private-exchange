import { useWeb3React } from '@web3-react/core'
import type { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { SupportedChainId } from '../constants'

export function useChainId() {
  const { library } = useWeb3React<ethers.providers.Web3Provider>()
  const [chainId, setChainId] = useState(1)

  useEffect(() => {
    ;(async () => {
      if (!library) {
        return
      }
      const result = await library.getNetwork()
      setChainId(result.chainId)
    })()
  }, [library])

  return chainId
}

export function useIsSupportedChain() {
  const [supported, setSupported] = useState(true)
  const chainId = useChainId()
  useEffect(() => {
    setSupported(Object.values(SupportedChainId).includes(chainId))
  }, [chainId])

  return supported
}
