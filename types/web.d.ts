import { SomeDBConnector } from '@zkopru/database/dist/web'
import { ZkAddress } from '@zkopru/transaction'
import ZkopruNode from './zkopru-node'
import ZkopruWallet from './zkopru-wallet'
import RpcClient from './rpc-client'
import { NodeConfig } from './types'

declare const _default: {
  RPC: typeof RpcClient
  Node: (config: NodeConfig, connector?: SomeDBConnector) => ZkopruNode
  Wallet: typeof ZkopruWallet
  ZkAddress: typeof ZkAddress
}
export default _default
export { ZkAccount } from '@zkopru/account'
export { UtxoStatus } from '@zkopru/transaction'
