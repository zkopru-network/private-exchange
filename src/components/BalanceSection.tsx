import React from 'react'
import styled from 'styled-components'
import useStore from '../store/zkopru'
import { FONT_SIZE, RADIUS, SPACE } from '../constants'

const BalanceSection = () => {
  const { tokenBalances, l2BalanceLoaded, balance } = useStore()

  return (
    <Container>
      <Title>
        L2 Balance
        <DepositLink href="https://zkopru.network/wallet" target="_blank">
          Deposit
        </DepositLink>
      </Title>
      <Row>
        <TokenLabel>ETH</TokenLabel>
        <TokenBalance>{balance}</TokenBalance>
      </Row>
      {!l2BalanceLoaded
        ? 'Loading...'
        : Object.keys(tokenBalances).map((symbol) => (
            <Row key={symbol}>
              <TokenLabel>{symbol}</TokenLabel>
              <TokenBalance>{tokenBalances[symbol]}</TokenBalance>
            </Row>
          ))}
    </Container>
  )
}

const Container = styled.div`
  margin-top: 120px;
  margin-right: 10px;
  width: calc(30% - 10px);
  height: fit-content;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  border-radius: ${RADIUS.M};
  border: solid 1px ${({ theme }) => theme.border};
  padding: ${SPACE.M};
`

const Title = styled.h2`
  margin: ${SPACE.XS} 0;
  font-size: ${FONT_SIZE.M};
`

const DepositLink = styled.a`
  float: right;
  font-weight: normal;
  text-decoration: underline;
`

const Row = styled.div`
  margin-top: ${SPACE.XS};
`

const TokenLabel = styled.span`
  display: inline-block;
  width: 60px;
`

const TokenBalance = styled.span``

export default BalanceSection
