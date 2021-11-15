import Web3 from 'web3'
import { RpcConfig, Block, Tx, Registry } from './types'

export default class RpcClient {
  config: RpcConfig

  private _web3?

  constructor(config: RpcConfig | string)

  get web3(): Web3

  getAddress(): Promise<string>

  syncing(): Promise<boolean>

  getBlockCount(): Promise<number>

  getBlockNumber(): Promise<number>

  getBlockByIndex(num: number | 'latest'): Promise<Block>

  getBlockByNumber(
    num: number | 'latest',
    includeUncles?: boolean,
  ): Promise<Block>

  getBlockByHash(hash: string | 'latest'): Promise<Block>

  getTransactionByHash(hash: string): Promise<Tx>

  getRegisteredTokens(): Promise<Registry>

  getVerifyingKeys(): Promise<any>

  private callMethod
}
