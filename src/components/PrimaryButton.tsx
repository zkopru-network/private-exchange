import styled from 'styled-components'
import { FONT_SIZE, SPACE, RADIUS } from '../constants'

const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.onPrimary};
  font-size: ${FONT_SIZE.S};
  padding: ${SPACE.S} ${SPACE.M};
  border-radius: ${RADIUS.S};
  border: none;
  box-shadow: 0px 1px 4px ${({ theme }) => theme.shadow};
  cursor: pointer;

  ${({ disabled }) =>
    disabled
      ? `
  opacity: 0.8;
  cursor: initial;
  `
      : ''}
`

export default PrimaryButton
