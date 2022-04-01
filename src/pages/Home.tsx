import styled from 'styled-components'
import Button from 'nanoether/Button'
import { PageBody, PageContainer, PageHead, Title } from '../components/Page'
import TokenSelector from '../components/TokenSelector'
import { FONT_SIZE } from '../constants'
import ExchangeImg from '../assets/exchange_img.png'

const Home = () => {
  return (
    <PageContainer>
      <PageHead>
        <Title>
          Welcome to <br /> Private Exchange
        </Title>
        <SubTitle>
          Private, safe & anti-fraud exchange network.
          <br />
          Get started by search the token you would like to purchase.
        </SubTitle>
        <SearchSection>
          <TokenSelector />
          <Button style={{ width: '100%', marginTop: '32px' }} type="solid">
            Search offers
          </Button>
        </SearchSection>
      </PageHead>
      <PageBody>
        <SectionTitle>How does it work?</SectionTitle>
        <SectionBody>
          <SectionRow>
            <SectionItem>
              <ItemTitle>For Seller</ItemTitle>
              <SectionImg src={ExchangeImg} alt="exchange" />
              <FeatureTitle>Create an offer</FeatureTitle>
              <Description>
                Got tokens and want to sell them for a <br /> desired price?
                Start by creating the <br /> offer and attract buyers.
              </Description>
            </SectionItem>
            <SectionItem>
              <ItemTitle>For Buyer</ItemTitle>
              <SectionImg src={ExchangeImg} alt="exchange" />
              <FeatureTitle>Search offer</FeatureTitle>
              <Description>
                Find the desired token you would like to <br /> trade, check
                pricing & start trading.
              </Description>
            </SectionItem>
          </SectionRow>
          <SectionItem>
            <ItemTitle>Seller & Buyer</ItemTitle>
            <SectionImg src={ExchangeImg} alt="exchange" />
            <FeatureTitle>Trade directly & privately</FeatureTitle>
            <Description>
              Find the match, agree with the pricing & <br /> trade. Directly &
              privately.
            </Description>
          </SectionItem>
        </SectionBody>
      </PageBody>
    </PageContainer>
  )
}

const SubTitle = styled.p`
  font-size: ${FONT_SIZE.M};
  text-align: center;
  color: ${({ theme }) => theme.textSub};
`

const SearchSection = styled.div`
  min-width: 280px;
  display: flex;
  flex-direction: column;
  margin-top: 56px;
`

const SectionTitle = styled.h2`
  font-size: 48px;
`

const SectionBody = styled.div`
  display: flex;
  flex-direction: column;
`

const SectionRow = styled.div`
  display: flex;
`

const SectionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SectionImg = styled.img`
  max-height: 240px;
`

const Description = styled.p`
  text-align: center;
`

const FeatureTitle = styled.h4`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
`

const ItemTitle = styled.h5`
  margin-bottom: 0;
  color: ${({ theme }) => theme.disabled};
  font-size: 18px;
  font-weight: 600;
`

export default Home
