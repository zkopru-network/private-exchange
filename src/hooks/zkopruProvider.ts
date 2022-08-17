import { useState, useEffect } from 'react'
import detectZkopru, { ZkopruProvider } from '../utils/zkopru'

export function useZkopru() {
  const [zkopru, setZkopru] = useState<ZkopruProvider | null>(null)
  const [active, setActive] = useState(false)
  const [account, setAccount] = useState<string | undefined>()

  useEffect(() => {
    window.addEventListener('ZKOPRU#PROVIDER_CONNECTED', async () => {
      const zkopru = await detectZkopru()
      setZkopru(zkopru)
      setActive(true)
      const account = await zkopru?.getAddress()
      setAccount(account)
    })
    ;(async () => {
      const zkopru = await detectZkopru()
      setZkopru(zkopru)
      if (zkopru?.connected) {
        setActive(true)
        const account = await zkopru?.getAddress()
        setAccount(account)
      }
    })()
  }, [])

  return { zkopru, active, account }
}
