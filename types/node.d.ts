import { SomeDBConnector } from '@zkopru/database/dist/node'
import ZkopruNode from './zkopru-node'
import ZkopruWallet from './zkopru-wallet'
import RpcClient from './rpc-client'
import { NodeConfig } from './types'

declare const _default: {
  RPC: typeof RpcClient
  Node: (config: NodeConfig, connector?: SomeDBConnector) => ZkopruNode
  Wallet: typeof ZkopruWallet
}
/**

Zkopru
 - RPC
 - Node sync
 - Wallet management
 - Proving key management

* */
export default _default
export { ZkAccount } from '@zkopru/account'
export { UtxoStatus } from '@zkopru/transaction'
