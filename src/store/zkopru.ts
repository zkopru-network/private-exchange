import create from 'zustand'

// TODO: update import path once correctly exported from @zkopru/client package
import ZkopruNode from '@zkopru/client/src/zkopru-node'
import ZkWallet from '@zkopru/client/src/zkopru-wallet'

// TODO: import ZkAddress from @zkopru/client
type ZkAddress = any

// TODO: import from appropriate package.
type ERC20Info = {
  address: string
  symbol: string
  decimals: number
}

export enum Status {
  NOT_SYNCING,
  PREPARING,
  CHECKING_VALIDITY,
  FULLY_SYNCED
}

export type State = {
  client: ZkopruNode | null
  latestBlock: number
  proposalCount: number
  uncleCount: number
  syncPercent: number
  status: Status
  syncing: boolean
  wallet: ZkWallet | null
  walletKey: string | null
  zkAddress: ZkAddress | null
  shortZkAddress: string | null
  lockedBalance: number | null
  balance: number | null
  tokensByAddress: { [key: string]: ERC20Info }
  tokenBalances: { [key: string]: number }
  l2BalanceLoaded: boolean
  registeredTokens: ERC20Info[]
}

export type Actions = {
  percent: () => number
  setZkAddress: (address: ZkAddress) => void
}

const useStore = create<State & Actions>((set, get) => ({
  client: null,
  latestBlock: 0,
  proposalCount: 0,
  uncleCount: 0,
  syncPercent: 0,
  status: Status.NOT_SYNCING,
  syncing: false,
  wallet: null,
  walletKey: null,
  zkAddress: null,
  shortZkAddress: null,
  lockedBalance: null,
  balance: null,
  tokenBalances: {},
  l2BalanceLoaded: false,
  registeredTokens: [],
  tokensByAddress: {},
  percent: () => {
    const { latestBlock, proposalCount } = get()
    if (!proposalCount) return 0
    return (100 * latestBlock) / proposalCount
  },
  setZkAddress: (address: ZkAddress) => {
    const length = 7
    const shortAddress = `${address.slice(0, length)}...${address.slice(
      -1 * length
    )}`
    set({
      zkAddress: address,
      shortZkAddress: shortAddress
    })
  }
}))

export default useStore
