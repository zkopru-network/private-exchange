import React from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { PageContainer, PageBody, PageHead, Title } from '../components/Page'
import { SPACE, FONT_SIZE } from '../constants'
import { useEffect } from 'react'
import { useState } from 'react'
import HistoryEntity, { HistoryType } from '../db/History'
import { IHistory } from '../db/db'

const HistoryTypeString = {
  [HistoryType.MakeAd]: 'Make Ad',
  [HistoryType.MatchMade]: 'Match Made',
  [HistoryType.MatchFailed]: 'Match Failed'
}

const renderHistory = (historyItem: IHistory) => (
  <Row key={historyItem.id}>
    <Cell>{HistoryTypeString[historyItem.historyType]}</Cell>
    <Cell>{dayjs.unix(historyItem.timestamp).format('MMM, DD HH:mm')}</Cell>
    <Cell>
      {historyItem.amount} {historyItem.currency1}
    </Cell>
    <Cell>
      {historyItem.receiveAmount} {historyItem.currency2}
    </Cell>
    <Cell>{historyItem.pending ? 'Pending' : 'Succeed'}</Cell>
  </Row>
)

const History = () => {
  const [historyList, setHistoryList] = useState<IHistory[]>([])

  useEffect(() => {
    // load on component did mount
    ;(async () => {
      const historyList = await HistoryEntity.findAll()
      setHistoryList(historyList)
    })()
  }, [])

  return (
    <PageContainer>
      <PageHead>
        <Title>History</Title>
      </PageHead>
      <Body>
        <HeadRow>
          <HeadCell>Type</HeadCell>
          <HeadCell>At</HeadCell>
          <HeadCell>Send</HeadCell>
          <HeadCell>Receive</HeadCell>
          <HeadCell>Status</HeadCell>
        </HeadRow>
        <div>{historyList.map(renderHistory)}</div>
      </Body>
    </PageContainer>
  )
}

const Body = styled(PageBody)`
  margin-top: 40px;
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
  font-size: ${FONT_SIZE.S};
`

const HeadCell = styled(Cell)`
  font-weight: 600;
`

export default History
