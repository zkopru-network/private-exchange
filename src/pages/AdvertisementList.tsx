import React, { useState, useEffect, useCallback } from 'react'
import styled, { useTheme } from 'styled-components'
import { Link, useLocation } from 'wouter'
import Fuse from 'fuse.js'
import Modal from 'react-modal'
import Title from '../components/Title'
import PrimaryButton from '../components/PrimaryButton'
import { PageContainer, PageBody, PageHead } from '../components/Page'
import { SPACE } from '../constants'
import {
  useAdvertisementsQuery,
  useDeleteAdvertisement,
  Advertisement
} from '../hooks/advertisement'
import { useStopPeer } from '../hooks/peer'
import { shortAddressString } from '../utils/string'
import SearchIcon from '../assets/search_icon.svg'
import { Trash2 } from 'react-feather'
import { useZkopru } from '../hooks/zkopruProvider'

const AdvertisementList = () => {
  const advertisementQuery = useAdvertisementsQuery()
  const setLocation = useLocation()[1]
  const deleteAd = useDeleteAdvertisement()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deletingAd, setDeletingAd] = useState<Advertisement | null>(null)
  const [fuse, setFuse] = useState<Fuse<Advertisement> | undefined>()
  const [searchWord, setSearchWord] = useState('')
  const stopPeer = useStopPeer()
  const theme = useTheme()
  const { account } = useZkopru()

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

  const isOwner = useCallback(
    (advertiser: string) => {
      if (!account) {
        return false
      }

      return account === advertiser
    },
    [account]
  )

  if (advertisementQuery.isLoading) {
    return <div>Loading...</div>
  }

  const result =
    advertisementQuery.data && fuse
      ? searchWord.length === 0
        ? advertisementQuery.data
        : fuse.search(searchWord).map((res) => res.item)
      : []

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)'
    },
    content: {
      border: `2px solid ${theme.border}`,
      borderRadius: '8px',
      backgroundColor: theme.surface,
      color: theme.onSurface,
      minWidth: '400px',
      minHeight: '300px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }
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
          <HeadCell style={{ width: '20px' }}></HeadCell>
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
                <Cell style={{ width: '20px' }}>
                  {isOwner(ad.advertiser) && (
                    <Trash2
                      onClick={() => {
                        setConfirmDelete(true)
                        setDeletingAd(ad)
                      }}
                      size={20}
                    />
                  )}
                </Cell>
              </Row>
            )
          })}
        </div>
      </PageBody>
      <Modal isOpen={confirmDelete} style={customStyles}>
        <ConfirmContainer>
          <ConfirmTitle>Are you sure you want to delete this ad?</ConfirmTitle>
          <ConfirmBody>
            <ConfirmItem>
              <ConfirmLabel>Pair</ConfirmLabel>
              <ConfirmValue>{deletingAd?.pair}</ConfirmValue>
            </ConfirmItem>
            <ConfirmItem>
              <ConfirmLabel>From amount</ConfirmLabel>
              <ConfirmValue>{deletingAd?.amount}</ConfirmValue>
            </ConfirmItem>
            <ConfirmItem>
              <ConfirmLabel>Buy/Sell</ConfirmLabel>
              <ConfirmValue>
                {deletingAd?.buyOrSell ? 'Buy' : 'Sell'}
              </ConfirmValue>
            </ConfirmItem>
          </ConfirmBody>
          <ConfirmButtons>
            <ConfirmButton
              onClick={() => {
                setDeletingAd(null)
                setConfirmDelete(false)
              }}
            >
              Cancel
            </ConfirmButton>
            <ConfirmButton
              onClick={() => {
                deleteAd(deletingAd?.id)
                stopPeer()
                setDeletingAd(null)
                setConfirmDelete(false)
              }}
            >
              Delete
            </ConfirmButton>
          </ConfirmButtons>
        </ConfirmContainer>
      </Modal>
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
  margin-bottom: 12px;
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

const ConfirmContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  min-height: 300px;
`

const ConfirmBody = styled.div`
  min-width: 240px;
`

const ConfirmItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${SPACE.M};
`

const ConfirmLabel = styled.span`
  font-weight: 600;
`

const ConfirmValue = styled.span``

const ConfirmButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`

const ConfirmButton = styled(PrimaryButton)`
  width: 140px;
`

const ConfirmTitle = styled.h2`
  margin: ${SPACE.M};
`

export default AdvertisementList
