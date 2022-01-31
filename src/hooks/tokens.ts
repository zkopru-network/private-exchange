import { ERC20Info } from '@zkopru/database'
import { useQuery } from 'react-query'
import useZkopruStore from '../store/zkopru'

export function useTokens() {
  const state = useZkopruStore.getState()

  return useQuery(
    ['tokens'],
    async () => {
      if (!state.client) throw new Error('client is not set')
      const erc20Info = await state.client.node?.loadERC20Info()
      if (!erc20Info)
        return [
          {
            symbol: 'ETH',
            decimals: 18,
            address: '0x0000000000000000000000000000000000000000'
          }
        ]
      return [
        {
          symbol: 'ETH',
          decimals: 18,
          address: '0x0000000000000000000000000000000000000000'
        },
        ...erc20Info
      ]
    },
    {
      enabled: !!state.client
    }
  )
}

export function useTokensMap() {
  const tokensQuery = useTokens()
  return {
    ...tokensQuery,
    data: tokensQuery.data?.reduce((acc, token) => {
      return { ...acc, [token.symbol]: token }
    }, {} as { [key: string]: ERC20Info })
  }
}
