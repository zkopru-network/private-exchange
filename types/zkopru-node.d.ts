import { SomeDBConnector, DB } from '@zkopru/database'
import { FullNode } from '@zkopru/core'
import { NodeConfig } from './types'

export default class ZkopruNode {
  config: NodeConfig

  _db?: DB

  node?: FullNode

  private connectorType

  constructor(_config: NodeConfig, connectorType: SomeDBConnector)

  get isRunning(): boolean

  private initDB

  private db

  initNode(...args: any[]): Promise<void>

  start(...args: any[]): Promise<void>

  stop(): Promise<void>

  resetDB(): Promise<void>

  registerERC20Tx(address: string): Promise<any>

  getERC20Contract(address: string): Promise<any>
}
