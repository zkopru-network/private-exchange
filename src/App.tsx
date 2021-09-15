import React from 'react'
import { Route, Switch } from 'wouter'

import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import AdvertisementList from './pages/AdvertisementList'
import AdvertisementForm from './pages/AdvertisementForm'
import GlobalStyle from './styles/global'
import { useEagerConnect } from './hooks/wallet'
import LoadingSpinner from './components/LoadingSpinner'
import SMPPanel from './components/SMPPanel'

function App() {
  const tried = useEagerConnect()

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
      </Switch>
      <Toaster />
      <SMPPanel />
    </>
  )
}

export default App
