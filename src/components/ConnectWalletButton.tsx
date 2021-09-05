import React from 'react'
import { useWeb3React } from '@web3-react/core'

import { injected } from '../connectors'
import PrimaryButton from './PrimaryButton'

const ConnectWalletButton = ({ text }: { text?: string }) => {
  const { activate } = useWeb3React()

  return (
    <PrimaryButton
      type="button"
      onClick={() => {
        console.log('hi')
        activate(injected)
      }}
    >
      {text ? text : 'Connect Wallet'}
    </PrimaryButton>
  )
}

export default ConnectWalletButton
