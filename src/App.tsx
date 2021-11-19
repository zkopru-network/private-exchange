import React from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'wouter'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import AdvertisementList from './pages/AdvertisementList'
import AdvertisementForm from './pages/AdvertisementForm'
import Exchange from './pages/Exchange'
import History from './pages/History'
import BalanceSection from './components/BalanceSection'
import GlobalStyle from './styles/global'
import { useEagerConnect } from './hooks/wallet'
import { useStartSync } from './hooks/zkopru'
import { useStartLoadExistingAd } from './hooks/advertisement'
import LoadingSpinner from './components/LoadingSpinner'
import SMPPanel from './components/SMPPanel'

function App() {
  const tried = useEagerConnect()
  useStartSync()
  useStartLoadExistingAd()

  if (!tried) return <LoadingSpinner />

  return (
    <>
      <GlobalStyle />
      <Header />
      <Container>
        <BodyContainer>
          <Switch>
            <Route path="/">
              <AdvertisementList />
            </Route>
            <Route path="/advertise">
              <AdvertisementForm />
            </Route>
            <Route path="/exchange/:id">
              <Exchange />
            </Route>
            <Route path="/history">
              <History />
            </Route>
            <Route path="/:rest*">
              {(params) => `404, page ${params.rest} does not exist!`}
            </Route>
          </Switch>
        </BodyContainer>
        <BalanceSection />
      </Container>
      <Toaster />
      <SMPPanel />
    </>
  )
}

const Container = styled.div`
  display: flex;
`

const BodyContainer = styled.div`
  width: 70%;
`

export default App
