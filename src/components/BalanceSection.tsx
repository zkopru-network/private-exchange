import React from 'react'
import styled from 'styled-components'
import useStore from '../store/zkopru'
import { FONT_SIZE, RADIUS } from '../constants'

const BalanceSection = () => {
  const { tokenBalances, l2BalanceLoaded, balance } = useStore()

  return (
    <Container>
      <Title>Balance</Title>
      <div>
        <span>ETH</span> :<span>{balance}</span>
      </div>
      {!l2BalanceLoaded
        ? 'Loading...'
        : Object.keys(tokenBalances).map((symbol) => (
            <div key={symbol}>
              <span>{symbol}</span> :<span>{tokenBalances[symbol]}</span>
            </div>
          ))}
    </Container>
  )
}

const Container = styled.div`
  margin-top: 84px;
  margin-right: 10px;
  width: calc(30% - 10px);
  height: fit-content;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  box-shadow: 0 1px 4px ${({ theme }) => theme.shadow};
  border-radius: ${RADIUS.M};
  padding: ${RADIUS.M};
`

const Title = styled.h2`
  margin: 0;
  font-size: ${FONT_SIZE.M};
`

export default BalanceSection
