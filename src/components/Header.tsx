import React from 'react'
import styled from 'styled-components'
import { Link } from 'wouter'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from './ConnectWalletButton'
import { FONT_SIZE, SPACE, RADIUS } from '../constants'
import { shortAddressString } from '../utils/string'

const Header = () => {
  const { account, active } = useWeb3React()

  return (
    <HeaderContainer>
      <Logo>PrivateExchange</Logo>
      <div>
        <HeaderLink href="/">Home</HeaderLink>
        <HeaderLink href="/advertise">Advertise</HeaderLink>
      </div>
      <div>
        {active && account ? (
          <Account>{shortAddressString(account)}</Account>
        ) : (
          <ConnectWalletButton />
        )}
      </div>
    </HeaderContainer>
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

export default Header
