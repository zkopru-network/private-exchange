import React from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'wouter'
import { Toaster } from 'react-hot-toast'
import { useBeforeunload } from 'react-beforeunload'
import Header from './components/Header'
import AdvertisementList from './pages/AdvertisementList'
import AdvertisementForm from './pages/AdvertisementForm'
import Exchange from './pages/Exchange'
import History from './pages/History'
import BalanceSection from './components/BalanceSection'
import GlobalStyle from './styles/global'
import { useEagerConnect } from './hooks/wallet'
import { useStartSync } from './hooks/zkopru'
import { usePostPeerInfo } from './hooks/peer'
import { useStartLoadExistingAd } from './hooks/advertisement'
import LoadingSpinner from './components/LoadingSpinner'
import SMPPanel from './components/SMPPanel'
import useZkopruStore from './store/zkopru'

function App() {
  const tried = useEagerConnect()
  const postPeerInfo = usePostPeerInfo()
  useStartSync()
  useStartLoadExistingAd()
  useBeforeunload(async () => {
    const { zkAddress } = useZkopruStore.getState()
    if (zkAddress) {
      // set peer status to offline
      await postPeerInfo(zkAddress, false)
    }
  })
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
