import db, { IAdvertisementForm } from './db'

export default class AdvertisementEntity {
  static async findLatest(): Promise<IAdvertisementForm | null> {
    const items = await db.advertisements.orderBy('id').limit(1).toArray()

    if (items.length === 1) return items[0]
    else return null
  }

  static async save(ad: IAdvertisementForm) {
    await db.advertisements.put(ad)
  }
}
