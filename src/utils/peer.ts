import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'PEER_ID'

export function getOrGeneratePeerId(): string {
  let peerId = localStorage.getItem(STORAGE_KEY)
  if (!peerId) {
    peerId = uuidv4()
    localStorage.setItem(STORAGE_KEY, peerId)
  }

  return peerId
}
