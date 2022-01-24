import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'wouter'
import Title from '../components/Title'
import PrimaryButton from '../components/PrimaryButton'
import { PageContainer, PageBody, PageHead } from '../components/Page'
import { SPACE } from '../constants'
import { useAdvertisementsQuery } from '../hooks/advertisement'
import { shortAddressString } from '../utils/string'

const AdvertisementList = () => {
  const advertisementQuery = useAdvertisementsQuery()
  const setLocation = useLocation()[1]

  if (advertisementQuery.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <PageContainer>
      <PageHead>
        <Title>Advertisement List</Title>
        <HeadLink href="/advertise">+ CREATE</HeadLink>
      </PageHead>
      <PageBody>
        <HeadRow>
          <HeadCell>Pair</HeadCell>
          <HeadCell>Amount</HeadCell>
          <HeadCell>Buy/Sell</HeadCell>
          <HeadCell>Peer id</HeadCell>
          <HeadCell>Action</HeadCell>
        </HeadRow>
        <div>
          {advertisementQuery.data &&
            advertisementQuery.data
              .filter((ad) => ad.amount > 0)
              .map((ad) => {
                return (
                  <Row key={ad.id}>
                    <Cell>{ad.pair}</Cell>
                    <Cell>{ad.amount}</Cell>
                    <Cell>{ad.buyOrSell ? 'Buy' : 'Sell'}</Cell>
                    <Cell>{shortAddressString(ad.advertiser)}</Cell>
                    <Cell>
                      <PrimaryButton
                        onClick={() => setLocation(`/exchange/${ad.id}`)}
                      >
                        Exchange
                      </PrimaryButton>
                    </Cell>
                  </Row>
                )
              })}
        </div>
      </PageBody>
    </PageContainer>
  )
}

const HeadLink = styled(Link)`
  cursor: pointer;
  font-weight: 600;
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
