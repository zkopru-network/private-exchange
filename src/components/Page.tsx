import styled from 'styled-components'
import { FONT_SIZE, RADIUS, SPACE } from '../constants'

export const PageContainer = styled.div`
  padding: ${SPACE.XL} ${SPACE.XXL};
`

export const PageHead = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: ${SPACE.L};
`

export const PageBody = styled.div`
  padding: ${SPACE.M};
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Title = styled.h1`
  font-size: ${FONT_SIZE.HUGE};
  font-weight: 900;
  color: ${({ theme }) => theme.textMain};
  text-align: center;
  line-height: 102px;
  margin: 0;
`
