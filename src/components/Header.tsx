import React from 'react'
import styled from 'styled-components'
import { Link } from 'wouter'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from './ConnectWalletButton'
import { FONT_SIZE, SPACE, RADIUS } from '../constants'
import { shortAddressString } from '../utils/string'
import { useIsSupportedChain } from '../hooks/network'

const Header = () => {
  const { account, active } = useWeb3React()
  const supportedChain = useIsSupportedChain()

  return (
    <>
      <HeaderContainer>
        <Logo>PrivateExchange</Logo>
        <div>
          <HeaderLink href="/">Home</HeaderLink>
          <HeaderLink href="/advertise">Advertise</HeaderLink>
          <HeaderLink href="/history">History</HeaderLink>
        </div>
        <div>
          {active && account ? (
            <Account>{shortAddressString(account)}</Account>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </HeaderContainer>
      {!supportedChain && <Notice>Current chain is not supported.</Notice>}
    </>
  )
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.onPrimary};
  height: 60px;
  padding: 0 20px;
`

const Logo = styled.span`
  font-family: Itim;
  font-size: ${FONT_SIZE.M};
  font-weight: 600;
`

const HeaderLink = styled(Link)`
  font-size: ${FONT_SIZE.M};
  font-weight: 600;
  margin-right: ${SPACE.M};
`

const Account = styled.span`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  font-size: ${FONT_SIZE.S};
  padding: ${SPACE.S} ${SPACE.M};
  margin-right: ${SPACE.M};
  border-radius: ${RADIUS.L};
  box-shadow: 0px 1px 4px ${({ theme }) => theme.shadow};
`

const Notice = styled.div`
  padding: ${SPACE.XS};
  background-color: ${({ theme }) => theme.warning};
  color: ${({ theme }) => theme.onWarning};
  text-align: center;
`

export default Header
