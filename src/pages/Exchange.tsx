import React, { useState } from 'react'
import styled from 'styled-components'
import { useRoute } from 'wouter'
import toast from 'react-hot-toast'
import Title from '../components/Title'
import { Input, Label, FormControl, FormValue } from '../components/Form'
import PrimaryButton from '../components/PrimaryButton'
import { useAdvertisementQuery, Advertisement } from '../hooks/advertisement'
import { RADIUS, SPACE, Tokens } from '../constants'
import { useSmp } from '../hooks/smp'
import { useSwap } from '../hooks/swap'

const Exchange = () => {
  // extract url params. always match path.
  const [match, params] = useRoute('/exchange/:id')
  const [sendAmount, setSendAmount] = useState(0)
  const id: string = (params as any).id

  // TODO:
  const ad = useAdvertisementQuery(id)
  // use exchange mutation
  const smpMutation = useSmp()
  const swapMutation = useSwap()

  const runSMP = async () => {
    const advertisement = ad?.data
    if (!advertisement) {
      console.error('ad not loaded.')
      return
    }
    const counterparty = advertisement.peerID

    const price = sendAmount / advertisement.amount.toNumber()
    toast('Starting smp....')
    const smpResult = await smpMutation.mutateAsync({
      price,
      counterpartyId: counterparty
    })
    toast(`Finish running smp. Result: ${smpResult ? 'Success' : 'Failed'}`)
    const [currency1, currency2] = advertisement.pair.split('/')
    const buyOrSell = advertisement.buyOrSell
    // @ts-ignore: TODO: post token address to peek-a-book-contract
    const sendToken = buyOrSell ? Tokens[currency1] : Tokens[currency2]
    // @ts-ignore: TODO: post token address to peek-a-book-contract
    const receiveToken = buyOrSell ? Tokens[currency2] : Tokens[currency1]

    if (smpResult) {
      try {
        toast('Creating swap transaction.')
        // TODO: make amount BigNumber after getting token info from contract.
        await swapMutation.mutateAsync({
          counterParty: advertisement.advertiser,
          sendToken,
          receiveToken,
          receiveAmount: advertisement.amount.toNumber(),
          sendAmount: sendAmount
        })
        toast.success('Successfully created swap transaction.')
      } catch (e) {
        toast.error('Failed to create swap transaction.')
      }
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
          <FormValue>{advertisement.peerID.toString()}</FormValue>
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
          <FormValue>{advertisement.amount.toString()}</FormValue>
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

export default Exchange
