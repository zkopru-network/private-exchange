import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'wouter'
import Title from '../components/Title'
import PrimaryButton from '../components/PrimaryButton'
import { RADIUS, SPACE } from '../constants'
import { useAdvertisementsQuery } from '../hooks/advertisement'

const AdvertisementList = () => {
  const advertisementQuery = useAdvertisementsQuery()
  const [location, setLocation] = useLocation()

  if (advertisementQuery.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Container>
      <PageHead>
        <Title>Advertisement List</Title>
        <HeadLink href="/advertise">+ CREATE</HeadLink>
      </PageHead>
      <Table>
        <HeadRow>
          <HeadCell>Pair</HeadCell>
          <HeadCell>Amount</HeadCell>
          <HeadCell>Buy/Sell</HeadCell>
          <HeadCell>Peer id</HeadCell>
          <HeadCell>Action</HeadCell>
        </HeadRow>
        <div>
          {advertisementQuery.data &&
            advertisementQuery.data.map((ad) => {
              return (
                <Row key={ad.adID.toHexString()}>
                  <Cell>{ad.pair}</Cell>
                  <Cell>{ad.amount.toString()}</Cell>
                  <Cell>{ad.buyOrSell ? 'Buy' : 'Sell'}</Cell>
                  <Cell>{ad.peerID}</Cell>
                  <Cell>
                    <PrimaryButton
                      onClick={() => setLocation(`/exchange/${ad.adID}`)}
                    >
                      Exchange
                    </PrimaryButton>
                  </Cell>
                </Row>
              )
            })}
        </div>
      </Table>
    </Container>
  )
}

const Container = styled.div`
  padding: ${SPACE.XL} ${SPACE.XXL};
`

const PageHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeadLink = styled(Link)`
  cursor: pointer;
  font-weight: 600;
`

const Table = styled.div`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  box-shadow: 0 1px 4px ${({ theme }) => theme.shadow};
  border-radius: ${RADIUS.M};
`

const Row = styled.div`
  padding: ${SPACE.S} ${SPACE.M};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeadRow = Row

const Cell = styled.span`
  width: 100px;
  display: flex;
  justify-content: center;
`

const HeadCell = styled(Cell)`
  font-weight: 600;
`

export default AdvertisementList
