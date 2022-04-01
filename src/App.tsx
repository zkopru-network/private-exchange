import { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'wouter'
import { Toaster } from 'react-hot-toast'
import { useBeforeunload } from 'react-beforeunload'
import UIContext from 'nanoether/interface'
import 'nanoether/colors.css'
import Header from './components/Header'
import Home from './pages/Home'
import AdvertisementList from './pages/AdvertisementList'
import AdvertisementForm from './pages/AdvertisementForm'
import Exchange from './pages/Exchange'
import History from './pages/History'
import GlobalStyle from './styles/global'
import { useEagerConnect } from './hooks/wallet'
import { useStartSync } from './hooks/zkopru'
import { usePostPeerInfo } from './hooks/peer'
import { useStartLoadExistingAd } from './hooks/advertisement'
import LoadingSpinner from './components/LoadingSpinner'
import SMPPanel from './components/SMPPanel'
import useZkopruStore from './store/zkopru'

function App() {
  const uiContext: any = useContext(UIContext)
  const tried = useEagerConnect()
  const postPeerInfo = usePostPeerInfo()
  useStartSync()
  useStartLoadExistingAd()
  useEffect(() => {
    uiContext.setDarkmode(true)
  }, [])
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
        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/list">
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
      </Container>
      <Toaster />
      <SMPPanel />
      <div style={{ display: 'none' }}>
        DEBUG
        <button
          onClick={async () => {
            const client = useZkopruStore.getState().client
            await client?.resetDB()
            window.location.reload()
          }}
        >
          clear db
        </button>
      </div>
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
`

export default App
