import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Route, Switch } from 'wouter'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import AdvertisementList from './pages/AdvertisementList'
import AdvertisementForm from './pages/AdvertisementForm'
import Exchange from './pages/Exchange'
import GlobalStyle from './styles/global'
import { useEagerConnect } from './hooks/wallet'
import { useStartSync } from './hooks/zkopru'
import LoadingSpinner from './components/LoadingSpinner'
import SMPPanel from './components/SMPPanel'

function App() {
  const tried = useEagerConnect()
  useStartSync()

  if (!tried) return <LoadingSpinner />

  return (
    <>
      <GlobalStyle />
      <Header />
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
        <Route path="/:rest*">
          {(params) => `404, page ${params.rest} does not exist!`}
        </Route>
      </Switch>
      <Toaster />
      <SMPPanel />
    </>
  )
}

export default App
