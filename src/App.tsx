import React from 'react'

import GlobalStyle from './styles/global'
import { useEagerConnect } from './hooks/wallet'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const tried = useEagerConnect()

  if (!tried) return <LoadingSpinner />

  return (
    <div>
      <GlobalStyle />
    </div>
  )
}

export default App
