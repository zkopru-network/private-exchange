import React from 'react'
import { Route, Switch } from 'wouter'

import Header from './components/Header'
import AdvertisementList from './pages/AdvertisementList'
import AdvertisementForm from './pages/AdvertisementForm'
import GlobalStyle from './styles/global'
import { useEagerConnect } from './hooks/wallet'
import LoadingSpinner from './components/LoadingSpinner'

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
        <Route path="/advertisement">
          <AdvertisementForm />
        </Route>
      </Switch>
    </>
  )
}

export default App
