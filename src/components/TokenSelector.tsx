import styled from 'styled-components'
import { RADIUS, SPACE } from '../constants'

const TokenSelector = () => {
  return <Container>Select Token</Container>
}

const Container = styled.div`
  padding: ${SPACE.S};
  border: solid 1px ${({ theme }) => theme.border};
  border-radius: ${RADIUS.M};
`

export default TokenSelector
