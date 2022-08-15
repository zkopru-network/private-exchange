import { useState, useEffect } from 'react'
import detectZkopru, { ZkopruProvider } from '../utils/zkopru'

export function useZkopru() {
  const [zkopru, setZkopru] = useState<ZkopruProvider | null>(null)
  const [active, setActive] = useState(false)
  const [account, setAccount] = useState<string | undefined>()

  useEffect(() => {
    window.addEventListener('ZKOPRU#PROVIDER_CONNECTED', () => {
      setActive(true)
    })
    ;(async () => {
      const zkopru = await detectZkopru()
      setActive(zkopru?.connected || false)
      setZkopru(zkopru)
      const account = await zkopru?.getAddress()
      setAccount(account)
    })()
  }, [])

  return { zkopru, active, account }
}
