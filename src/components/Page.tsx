import styled from 'styled-components'
import { RADIUS, SPACE } from '../constants'

export const PageContainer = styled.div`
  padding: ${SPACE.XL} ${SPACE.XXL};
`

export const PageHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PageBody = styled.div`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  border: solid 1px ${({ theme }) => theme.border};
  border-radius: ${RADIUS.M};
  padding: ${SPACE.M};
`
