import React from 'react'
import styled from 'styled-components'

import PrimaryButton from './PrimaryButton'
import { useZkopru } from '../hooks/zkopruProvider'

const ConnectWalletButton = ({ text }: { text?: string }) => {
  const { zkopru } = useZkopru()

  return (
    <Button
      type="button"
      onClick={() => {
        zkopru?.connect()
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
