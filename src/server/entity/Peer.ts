import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class PeerInfo {
  @PrimaryColumn()
  id: string

  @Column()
  isOnline: boolean
}
