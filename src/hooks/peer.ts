import axios from 'axios'
import { useCallback } from 'react'
import { useQuery } from 'react-query'
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
