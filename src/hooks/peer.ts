import axios from 'axios'
import { useCallback } from 'react'
import { useQuery } from 'react-query'
import useStore, { PEER_STATUS } from '../store/peer'
import { API_ROOT } from '../constants'

type PeerInfo = {
  id: string
  isOnline: boolean
}

export function usePeerInfoQuery(id: string) {
  return useQuery<PeerInfo>(['peerInfo', id], async () => {
    const res = await axios.get<PeerInfo>(`${API_ROOT}/peerInfo/${id}`)
    return res.data
  })
}

export function usePostPeerInfo() {
  return useCallback(async (peerId: string, isOnline: boolean) => {
    await axios.post(`${API_ROOT}/peerInfo`, {
      id: peerId,
      isOnline
    })
  }, [])
}

export function useStopPeer() {
  const peerStore = useStore()
  return useCallback(() => {
    const { peer } = peerStore
    if (peer) {
      peerStore.setPeer(null)
      peerStore.setPeerStatus(PEER_STATUS.OFF)
    }
  }, [peerStore])
}
