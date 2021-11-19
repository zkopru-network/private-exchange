export type Token = {
  name: string
  symbol: string
  address: string
  decimals: number
}

const tokens = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000'
  },
  {
    name: 'Test Token',
    symbol: 'TT',
    decimals: 4,
    address: '0x1D7022f5B17d2F8B695918FB48fa1089C9f85401'
  }
]

export default tokens
