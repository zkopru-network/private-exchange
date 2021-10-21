import React from 'react'
import styled from 'styled-components'
import { useRoute } from 'wouter'
import Title from '../components/Title'
import { Input, Label, FormControl, FormValue } from '../components/Form'
import PrimaryButton from '../components/PrimaryButton'
import { useAdvertisementQuery, Advertisement } from '../hooks/advertisement'
import { RADIUS, SPACE } from '../constants'
import { useState } from 'react'

const Exchange = () => {
  // extract url params. always match path.
  const [match, params] = useRoute('/exchange/:id')
  const [price, setPrice] = useState(0)
  const id: string = (params as any).id

  // TODO:
  const ad = useAdvertisementQuery(id)
  // use exchange mutation

  const runSMP = () => {
    console.log('do smp', price)
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
            Amount ({advertisement.buyOrSell ? currency2 : currency1})
          </Label>
          <FormValue>{advertisement.amount.toString()}</FormValue>
        </FormControl>
        <FormControl>
          <Label>PeerID</Label>
          <FormValue>{advertisement.peerID.toString()}</FormValue>
        </FormControl>
        <FormControl>
          <Label>
            Price (
            {advertisement.buyOrSell
              ? `${currency1}/${currency2}`
              : `${currency2}/${currency1}`}
            ) (*private field)
          </Label>
          <Input
            placeholder="0.0"
            type="number"
            onChange={(e) => setPrice(Number(e.target.value))}
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
