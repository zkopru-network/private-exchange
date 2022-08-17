import { ERC20Info } from '@zkopru/database'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'
import rpcClient from '../utils/rpcClient'

export const abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
]

export function useRegisteredERC20s() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:5000')

  return useQuery<ERC20Info[]>(['tokens'], async () => {
    const res = await rpcClient.getRegisteredTokens()
    if (!res.data) throw new Error('No data returned')
    const tokens = res.data.result
    const erc20s: ERC20Info[] = await Promise.all(
      tokens.erc20s.map(async (address: string) => {
        const contract = new ethers.Contract(address, abi, provider)
        const [symbol, decimals] = [
          await contract.symbol(),
          await contract.decimals()
        ]
        return { symbol, decimals, address }
      })
    )

    return [
      {
        symbol: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000'
      },
      ...erc20s
    ]
  })
}

export function useTokensMap() {
  const tokensQuery = useRegisteredERC20s()
  return {
    ...tokensQuery,
    data: tokensQuery.data?.reduce((acc, token) => {
      return { ...acc, [token.symbol]: token }
    }, {} as { [key: string]: ERC20Info })
  }
}
