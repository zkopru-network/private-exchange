import styled from 'styled-components'
import { SPACE, RADIUS, FONT_SIZE } from '../constants'

export const FormControl = styled.div`
  width: 100%;
  margin: ${SPACE.M} 0px;

  &:first-child {
    margin-top: 0;
  }
`

export const Input = styled.input<{ error?: boolean }>`
  font-size: ${FONT_SIZE.L};
  padding: ${SPACE.XS} ${SPACE.S};
  border-radius: ${RADIUS.M};
  border: solid 1px ${({ theme }) => theme.border};
  ${({ error, theme }) => (error ? `border-color: ${theme.error}` : '')};
  width: 100%;
`

export const Label = styled.label`
  display: block;
  font-size: ${FONT_SIZE.S};
  font-weight: 600;
  color: ${({ theme }) => theme.onBackground};
  margin-bottom: ${SPACE.XS};
`

export const FormValue = styled.span`
  font-size: ${FONT_SIZE.M};
`

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: ${FONT_SIZE.S};
  height: 12px;
`
