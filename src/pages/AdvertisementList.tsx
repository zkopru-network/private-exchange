import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'wouter'
import Fuse from 'fuse.js'
import Title from '../components/Title'
import PrimaryButton from '../components/PrimaryButton'
import { PageContainer, PageBody, PageHead } from '../components/Page'
import { SPACE } from '../constants'
import { useAdvertisementsQuery, Advertisement } from '../hooks/advertisement'
import { shortAddressString } from '../utils/string'
import SearchIcon from '../assets/search_icon.svg'

const AdvertisementList = () => {
  const advertisementQuery = useAdvertisementsQuery()
  const setLocation = useLocation()[1]
  const [fuse, setFuse] = useState<Fuse<Advertisement> | undefined>()
  const [searchWord, setSearchWord] = useState('')

  useEffect(() => {
    // set fuse when advertisements loaded
    if (advertisementQuery.data) {
      setFuse(
        new Fuse(
          advertisementQuery.data.filter((ad) => ad.amount > 0),
          {
            keys: ['pair'],
            includeMatches: true,
            minMatchCharLength: 2
          }
        )
      )
    }
  }, [advertisementQuery.data])

  if (advertisementQuery.isLoading) {
    return <div>Loading...</div>
  }

  const result =
    advertisementQuery.data && fuse
      ? searchWord.length === 0
        ? advertisementQuery.data
        : fuse.search(searchWord).map((res) => res.item)
      : []

  return (
    <PageContainer>
      <PageHead>
        <Title>Advertisement List</Title>
        <HeadLink href="/advertise">+ CREATE</HeadLink>
      </PageHead>
      <SearchSection>
        <Input
          placeholder="search"
          onChange={(e) => {
            setSearchWord(e.target.value)
          }}
        />
        <SearchImg src={SearchIcon} />
      </SearchSection>
      <PageBody>
        <HeadRow>
          <HeadCell>Pair</HeadCell>
          <HeadCell>Amount</HeadCell>
          <HeadCell>Buy/Sell</HeadCell>
          <HeadCell>Peer id</HeadCell>
          <HeadCell>Action</HeadCell>
        </HeadRow>
        <div>
          {result.map((ad) => {
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

const SearchSection = styled.div`
  margin-bottom: ${SPACE.M};
  position: relative;
`

const Input = styled.input`
  background-color: ${({ theme }) => theme.surface};
  border: solid 1px ${({ theme }) => theme.border};
  border-radius: 20px;
  color: ${({ theme }) => theme.onSurface};
  height: 28px;
  padding: 2px 10px;
  padding-left: 28px;
`

const SearchImg = styled.img`
  position: absolute;
  left: 4px;
`

export default AdvertisementList
