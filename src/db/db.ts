import Dexie from 'dexie'

export interface IAdvertisementForm {
  id?: number
  currency1: string
  currency2: string
  amount: number
  receiveAmount: number
}

class DB extends Dexie {
  advertisements: Dexie.Table<IAdvertisementForm, number>

  constructor() {
    super('PrivateExchange')

    this.version(1).stores({
      advertisements: '++id, currency1, currency2, amount, receiveAmount'
    })

    this.advertisements = this.table('advertisements')
  }
}

export default new DB()
