import React from 'react'
import styled from 'styled-components'
import useStore from '../store'
import { SPACE, RADIUS } from '../constants'

const SMPPanel = () => {
  const peer = useStore((state) => state.peer)

  if (!peer)
    return (
      <Container>
        <Indicator off />
        <Message>There are no ads order</Message>
      </Container>
    )

  return (
    <Container>
      <Indicator />
      <Message>SMP peer is running</Message>
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  bottom: ${SPACE.M};
  right: ${SPACE.M};
  width: 200px;
  height: 40px;
  padding: ${SPACE.S};
  border-radius: ${RADIUS.M};

  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  box-shadow: 0 1px 3px ${({ theme }) => theme.shadow};

  display: flex;
  align-items: center;
`

const Indicator = styled.span<{ off?: boolean }>`
  height: 8px;
  width: 8px;
  border-radius: 4px;
  background-color: ${({ off }) => (off ? '#b5b5b5' : 'green')};
  box-shadow: 0 0 3px ${({ off }) => (off ? '#b5b5b5' : 'green')};
`

const Message = styled.p`
  margin-left: ${SPACE.S};
`

export default SMPPanel
