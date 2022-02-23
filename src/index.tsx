import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { Web3ReactProvider } from '@web3-react/core'
import { QueryClient, QueryClientProvider } from 'react-query'
import Modal from 'react-modal'
import App from './App'
import getLibrary from './utils/getLibrary'
import theme from './styles/theme'

const queryClient = new QueryClient()
Modal.setAppElement('#root')

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
