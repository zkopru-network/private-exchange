import React, { useState } from 'react'
import styled from 'styled-components'
import { useRoute } from 'wouter'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import Title from '../components/Title'
import { Input, Label, FormControl, FormValue } from '../components/Form'
import PrimaryButton from '../components/PrimaryButton'
import { useAdvertisementQuery, Advertisement } from '../hooks/advertisement'
import { useRunSmp } from '../hooks/smp'
import { useSwap } from '../hooks/swap'
import { FONT_SIZE, RADIUS, SPACE, Tokens } from '../constants'
import { toScaled, pow10, toUnscaled } from '../utils/bn'
import { shortAddressString } from '../utils/string'
import HistoryEntity, { HistoryType } from '../db/History'

const Exchange = () => {
  // extract url params. always match path.
  const params = useRoute('/exchange/:id')[1]
  const [sendAmount, setSendAmount] = useState(0)
  const [receiveAmount, setReceiveAmount] = useState(0)
  const id: string = (params as any).id

  const ad = useAdvertisementQuery(id)
  const smpMutation = useRunSmp()
  const swapMutation = useSwap()

  const runSMP = async () => {
    const advertisement = ad?.data
    if (!advertisement) {
      console.error('ad not loaded.')
      return
    }

    toast('Starting smp....')
    const counterParty = advertisement.peerID
    const [currency1, currency2] = advertisement.pair.split('/')
    const buyOrSell = advertisement.buyOrSell
    const sendTokenSymbol = buyOrSell ? currency1 : currency2
    const receiveTokenSymbol = buyOrSell ? currency2 : currency1
    const sendToken = Tokens[sendTokenSymbol].address
    const receiveToken = Tokens[receiveTokenSymbol].address
    const sendDecimals = Tokens[sendTokenSymbol].decimals
    const receiveDecimals = Tokens[receiveTokenSymbol].decimals

    const price = toScaled(sendAmount, sendDecimals)
      .mul(pow10(receiveDecimals))
      .div(toScaled(receiveAmount, receiveDecimals))

    const smpResult = await smpMutation.mutateAsync({
      price: price.toString(),
      counterpartyId: counterParty,
      amount: receiveAmount
    })
    toast(
      `Finish running smp. Result: ${
        smpResult.result ? 'Success' : 'Failed'
      }: Amount: ${smpResult.negotiatedAmount}`
    )

    if (smpResult.result) {
      try {
        const receive = toScaled(smpResult.negotiatedAmount, receiveDecimals)
        const send = price.mul(receive).div(pow10(receiveDecimals))
        toast(
          `Creating swap transaction. send ${sendTokenSymbol}: ${send.toString()}, receive ${receiveTokenSymbol}: ${receive.toString()}`
        )
        await swapMutation.mutateAsync({
          counterParty,
          sendToken,
          receiveToken,
          receiveAmount: receive,
          sendAmount: send
        })
        toast.success('Successfully created swap transaction.')
        await HistoryEntity.save({
          historyType: HistoryType.MatchMade,
          timestamp: dayjs().unix(),
          adId: Number(id),
          currency1: sendTokenSymbol,
          currency2: receiveTokenSymbol,
          amount: toUnscaled(send, sendDecimals),
          receiveAmount: toUnscaled(receive, receiveDecimals),
          pending: true
        })
      } catch (e) {
        toast.error('Failed to create swap transaction.')
      }
    } else {
      await HistoryEntity.save({
        historyType: HistoryType.MatchFailed,
        timestamp: dayjs().unix(),
        adId: Number(id),
        currency1: sendTokenSymbol,
        currency2: receiveTokenSymbol,
        amount: sendAmount,
        receiveAmount: receiveAmount
      })
    }
  }

  if (ad.isLoading && !ad.data) {
    return (
      <Container>
        <PageHead>
          <Title>Exchange</Title>
        </PageHead>
        <FormContainer>Loading...</FormContainer>
      </Container>
    )
  }

  const advertisement: Advertisement = ad.data as any
  const [currency1, currency2] = advertisement.pair.split('/')

  return (
    <Container>
      <PageHead>
        <Title>Exchange</Title>
        <HeadLink
          onClick={() => {
            window.history.back()
          }}
        >
          &larr; Back
        </HeadLink>
      </PageHead>
      <FormContainer>
        <FormControl>
          <Label>PeerID</Label>
          <FormValue>
            {shortAddressString(advertisement.peerID.toString())}
          </FormValue>
        </FormControl>
        <FormControl>
          <Label>Pair</Label>
          <FormValue>{advertisement.pair.toString()}</FormValue>
        </FormControl>
        <FormControl>
          <Label>From</Label>
          <FormValue>
            {advertisement.buyOrSell ? currency1 : currency2}
          </FormValue>
          <Label>To</Label>
          <FormValue>
            {advertisement.buyOrSell ? currency2 : currency1}
          </FormValue>
        </FormControl>
        <FormControl>
          <Label>
            Amount Receive({advertisement.buyOrSell ? currency2 : currency1})
          </Label>
          {/* TODO: validate form */}
          <Input
            placeholder="0.0"
            type="number"
            onChange={(e) => setReceiveAmount(Number(e.target.value))}
          />
          <FootNote>Max: {advertisement.amount.toString()}</FootNote>
        </FormControl>
        <FormControl>
          <Label>
            Amount Send({advertisement.buyOrSell ? currency1 : currency2})
          </Label>
          <Input
            placeholder="0.0"
            type="number"
            onChange={(e) => setSendAmount(Number(e.target.value))}
          />
        </FormControl>
        <PrimaryButton onClick={runSMP}>Exchange</PrimaryButton>
      </FormContainer>
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

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  box-shadow: 0 1px 4px ${({ theme }) => theme.shadow};
  border-radius: ${RADIUS.M};
  padding: ${SPACE.M};
`

const HeadLink = styled.a`
  cursor: pointer;
  font-weight: 600;
`

const FootNote = styled.span`
  font-size: ${FONT_SIZE.S};
`

export default Exchange
