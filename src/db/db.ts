import Dexie from 'dexie'

export interface IAdvertisementForm {
  id: number
  currency1: string
  currency2: string
  amount: number
  receiveAmount: number
  exchanged: boolean
  advertiser: string
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
  advertisements!: Dexie.Table<IAdvertisementForm>
  histories!: Dexie.Table<IHistory, number>

  constructor() {
    super('PrivateExchange')

    this.version(3).stores({
      advertisements:
        'id, currency1, currency2, amount, receiveAmount, exchanged, advertiser',
      histories:
        '++id, historyType, adId, currency1, currency2, amount, receiveAmount, timestamp, pending, txHash'
    })

    this.advertisements = this.table('advertisements')
    this.histories = this.table('histories')
  }
}

export default new DB()
