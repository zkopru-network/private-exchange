import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Advertisement {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  advertiser: string

  @Column()
  peerId: string

  @Column()
  pair: string

  @Column()
  buyOrSell: boolean

  @Column()
  amount: number
}
