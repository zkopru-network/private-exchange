import styled from 'styled-components'
import { FONT_SIZE, SPACE } from '../constants'

const Title = styled.h1`
  font-size: ${FONT_SIZE.L};
  font-weight: 500;
  color: ${({ theme }) => theme.onSurface};
  border-bottom: solid 1px ${({ theme }) => theme.primary};
  padding-bottom: ${SPACE.XS};
`

export default Title
