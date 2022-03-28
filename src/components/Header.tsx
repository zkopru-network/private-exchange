import styled from 'styled-components'
import { Link } from 'wouter'
import { useWeb3React } from '@web3-react/core'
import { useLocation } from 'wouter'
import ConnectWalletButton from './ConnectWalletButton'
import { FONT_SIZE, SPACE, RADIUS } from '../constants'
import { shortAddressString } from '../utils/string'
import { useIsSupportedChain } from '../hooks/network'
import LogoSrc from '../assets/logo.svg'
import searchSrc from '../assets/search-line.svg'
import createSrc from '../assets/pen.svg'

const Header = () => {
  const { account, active } = useWeb3React()
  const supportedChain = useIsSupportedChain()
  const [location] = useLocation()

  return (
    <>
      <HeaderContainer>
        <Link href="/">
          <img src={LogoSrc} alt="logo" height="40px" />
        </Link>
        <HeaderRight>
          <HeaderLink href="/list" selected={location === '/list'}>
            <HeaderLinkImg src={searchSrc} alt="search" />
            Search
          </HeaderLink>
          <HeaderLink href="/advertise" selected={location === '/advertise'}>
            <HeaderLinkImg src={createSrc} alt="create offer" />
            Create offer
          </HeaderLink>

          {active && account ? (
            <Account>{shortAddressString(account)}</Account>
          ) : (
            <ConnectWalletButton />
          )}
        </HeaderRight>
      </HeaderContainer>
      {!supportedChain && <Notice>Current chain is not supported.</Notice>}
    </>
  )
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.onBackground};
  height: 88px;
  padding: 0 20px;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`

const HeaderLink = styled(Link)<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  font-size: ${FONT_SIZE.M};
  font-weight: 600;
  margin-right: ${SPACE.M};
  border-radius: ${RADIUS.S};
  padding: ${SPACE.S};
  padding-right: ${SPACE.M};
  ${({ selected, theme }) =>
    selected
      ? `
  background-color: ${theme.surface};
  color: ${theme.onSurface};
  `
      : ''}
`

const HeaderLinkImg = styled.img`
  margin-right: ${SPACE.S};
`

const Account = styled.span`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  font-size: ${FONT_SIZE.S};
  padding: ${SPACE.S} ${SPACE.M};
  margin-right: ${SPACE.M};
  border-radius: 30px;
  border: solid 1px ${({ theme }) => theme.border};
`

const Notice = styled.div`
  padding: ${SPACE.XS};
  background-color: ${({ theme }) => theme.warning};
  color: ${({ theme }) => theme.onWarning};
  text-align: center;
`

export default Header
