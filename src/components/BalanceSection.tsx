import React from 'react'
import styled from 'styled-components'
import { FONT_SIZE, RADIUS, SPACE } from '../constants'
import { useBalance } from '../hooks/balance'

const BalanceSection = () => {
  const balanceQuery = useBalance()

  return (
    <Container>
      <Title>L2 Balance</Title>
      {balanceQuery.isLoading ? (
        'Loading...'
      ) : balanceQuery.data ? (
        <>
          <Row>
            <TokenLabel>ETH</TokenLabel>
            <TokenBalance>{balanceQuery.data.eth || '0'}</TokenBalance>
          </Row>
          {Object.keys(balanceQuery.data.tokenBalances).map((symbol) => (
            <Row key={symbol}>
              <TokenLabel>{symbol}</TokenLabel>
              <TokenBalance>
                {balanceQuery.data.tokenBalances[symbol] || 0}
              </TokenBalance>
            </Row>
          ))}
        </>
      ) : (
        <div>No data</div>
      )}
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

const Row = styled.div`
  margin-top: ${SPACE.XS};
`

const TokenLabel = styled.span`
  display: inline-block;
  width: 60px;
`

const TokenBalance = styled.span``

export default BalanceSection
