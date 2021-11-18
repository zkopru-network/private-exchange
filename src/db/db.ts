import Dexie from 'dexie'

export interface IAdvertisementForm {
  adId: number
  currency1: string
  currency2: string
  amount: number
  receiveAmount: number
  exchanged: boolean
}

export enum HistoryType {
  MakeAd,
  MatchMade,
  MatchFailed
}

export interface IHistory {
  id?: number
  historyType: HistoryType
  adId: number
  currency1: string
  currency2: string
  amount: number
  receiveAmount: number
  timestamp: number
  pending?: boolean
  txHash?: string
}

class DB extends Dexie {
  advertisements: Dexie.Table<IAdvertisementForm, number>
  histories: Dexie.Table<IHistory, number>

  constructor() {
    super('PrivateExchange')

    this.version(2).stores({
      advertisements:
        'adId, currency1, currency2, amount, receiveAmount, exchanged',
      histories:
        '++id, historyType, adId, currency1, currency2, amount, receiveAmount, timestamp, pending'
    })

    this.advertisements = this.table('advertisements')
    this.histories = this.table('histories')
  }
}

export default new DB()
