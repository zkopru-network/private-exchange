import React from 'react'
import styled from 'styled-components'
import { Link } from 'wouter'
import { useLocation } from 'wouter'
import ConnectWalletButton from './ConnectWalletButton'
import { FONT_SIZE, SPACE, RADIUS } from '../constants'
import { shortAddressString } from '../utils/string'
import { useZkopru } from '../hooks/zkopruProvider'

const Header = () => {
  const { active, account } = useZkopru()
  const [location] = useLocation()

  return (
    <>
      <HeaderContainer>
        <Logo>PrivateExchange</Logo>
        <div>
          <HeaderLink href="/" selected={location === '/'}>
            Home
          </HeaderLink>
          <HeaderLink href="/advertise" selected={location === '/advertise'}>
            Advertise
          </HeaderLink>
          <HeaderLink href="/history" selected={location === '/history'}>
            History
          </HeaderLink>
        </div>
        <div>
          {active && account ? (
            <Account>{shortAddressString(account)}</Account>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </HeaderContainer>
    </>
  )
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.background};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.onBackground};
  height: 60px;
  padding: 0 20px;
`

const Logo = styled.span`
  font-family: serif;
  font-size: ${FONT_SIZE.M};
  font-weight: 600;
  color: ${({ theme }) => theme.onSurface};
`

const HeaderLink = styled(Link)<{ selected?: boolean }>`
  font-size: ${FONT_SIZE.M};
  font-weight: 600;
  margin-right: ${SPACE.M};
  border-radius: ${RADIUS.S};
  padding: ${SPACE.S};
  ${({ selected, theme }) =>
    selected
      ? `
  background-color: ${theme.surface2};
  color: ${theme.onSurface};
  `
      : ''}
`

const Account = styled.span`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  font-size: ${FONT_SIZE.S};
  padding: ${SPACE.S} ${SPACE.M};
  margin-right: ${SPACE.M};
  border-radius: ${RADIUS.L};
  border: solid 1px ${({ theme }) => theme.border};
`

export default Header
