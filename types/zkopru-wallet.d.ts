/// <reference types="node" />
import { ZkWalletAccount } from '@zkopru/zk-wizard'
import { RawTx } from '@zkopru/transaction'
import { F } from '@zkopru/babyjubjub'
import ZkopruNode from './zkopru-node'

export default class ZkopruWallet {
  node: ZkopruNode

  wallet: ZkWalletAccount

  constructor(node: ZkopruNode, privateKey: Buffer | string)

  generateEtherTransfer(
    to: string,
    amountWei: string,
    weiPerByte: number | string,
  ): Promise<RawTx>

  generateTokenTransfer(
    to: string,
    erc20Amount: string,
    tokenAddr: string,
    weiPerByte: number | string,
  ): Promise<RawTx>

  generateWithdrawal(
    to: string,
    amountWei: string,
    weiPerByte: number | string,
    prepayFeeWei: string,
  ): Promise<RawTx>

  generateTokenWithdrawal(
    to: string,
    erc20Amount: string,
    tokenAddr: string,
    weiPerByte: number | string,
    prepayFeeWei: string,
  ): Promise<
    RawTx & {
      withdrawals: import('@zkopru/transaction').Withdrawal[]
    }
  >

  generateSwapTransaction(
    to: string,
    sendTokenAddress: string,
    sendAmount: string,
    receiveTokenAddress: string,
    receiveAmount: string,
    weiPerByte: number | string,
    salt: F,
  ): Promise<RawTx>

  loadCurrentPrice(): Promise<any>

  transactionsFor(
    zkAddress: string,
    ethAddress: string,
  ): Promise<{
    pending: any[]
    history: any[]
  }>
}
