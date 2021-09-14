import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

import { injected } from '../connectors'
import PrimaryButton from './PrimaryButton'

const ConnectWalletButton = ({ text }: { text?: string }) => {
  const { activate } = useWeb3React()

  return (
    <Button
      type="button"
      onClick={() => {
        activate(injected)
      }}
    >
      {text ? text : 'Connect Wallet'}
    </Button>
  )
}

const Button = styled(PrimaryButton)`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
`

export default ConnectWalletButton
