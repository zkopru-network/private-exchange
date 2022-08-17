import { useQuery } from 'react-query'
import { useZkopru } from './zkopruProvider'

export function useBalance() {
  const { zkopru, active } = useZkopru()
  return useQuery(
    ['balance'],
    async () => {
      if (!zkopru) throw new Error('Zkopru provider not set')
      if (!active) throw new Error('Zkopru is not active')
      return await zkopru.getBalance()
    },
    {
      enabled: !!zkopru && !!active
    }
  )
}
