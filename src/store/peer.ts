import create from 'zustand'
import SMPPeer from 'js-smp-peer'

export enum PEER_STATUS {
  OFF,
  STARTING,
  RUNNING
}

export type State = {
  peer: SMPPeer | null
  peerStatus: PEER_STATUS
  setPeer: (peer: SMPPeer | null) => void
  setPeerStatus: (peerStatus: PEER_STATUS) => void
}

const useStore = create<State>((set) => ({
  peer: null,
  peerStatus: PEER_STATUS.OFF,
  setPeer: (peer: SMPPeer | null) => set({ peer }),
  setPeerStatus: (peerStatus: PEER_STATUS) => set({ peerStatus })
}))

export default useStore
