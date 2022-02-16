import db, { IHistory, HistoryType } from './db'

export { HistoryType }

export default class HistoryEntity {
  static async findAll(): Promise<IHistory[]> {
    return await db.histories.toArray()
  }

  static async findPendingMatchMades(): Promise<IHistory[]> {
    return (
      await db.histories
        .where('historyType')
        .equals(HistoryType.MatchMade)
        .toArray()
    ).filter((history) => history.pending)
  }

  static async save(history: IHistory) {
    await db.histories.put(history)
  }

  static async delete(id: number) {
    await db.histories.delete(id)
  }
}
