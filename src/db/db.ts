import Dexie from 'dexie'

export interface IAdvertisementForm {
  adId: number
  currency1: string
  currency2: string
  amount: number
  receiveAmount: number
  exchanged: boolean
}

class DB extends Dexie {
  advertisements: Dexie.Table<IAdvertisementForm, number>

  constructor() {
    super('PrivateExchange')

    this.version(1).stores({
      advertisements:
        'adId, currency1, currency2, amount, receiveAmount, exchanged'
    })

    this.advertisements = this.table('advertisements')
  }
}

export default new DB()
