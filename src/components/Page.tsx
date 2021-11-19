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
  box-shadow: 0 1px 4px ${({ theme }) => theme.shadow};
  border-radius: ${RADIUS.M};
  padding: ${SPACE.M};
`
