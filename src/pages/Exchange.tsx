import React from 'react'
import styled from 'styled-components'
import { useRoute } from 'wouter'
import Title from '../components/Title'
import PrimaryButton from '../components/PrimaryButton'
import { RADIUS, SPACE } from '../constants'

const Exchange = () => {
  // extract url params. always match path.
  const [match, params] = useRoute('/exchange/:id')
  const id = (params as any).id

  // TODO:
  // useAdvertisement
  // use loading state
  // use exchange mutation

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
      AD ID: {id}
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

const HeadLink = styled.a`
  cursor: pointer;
  font-weight: 600;
`

export default Exchange
