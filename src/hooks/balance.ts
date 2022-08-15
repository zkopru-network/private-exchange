import { useQuery } from 'react-query'
import { useZkopru } from './zkopruProvider'

export function useBalance() {
  const { zkopru } = useZkopru()
  return useQuery(
    ['balance'],
    async () => {
      if (!zkopru) throw new Error('Zkopru provider not set')
      return await zkopru.getBalance()
    },
    {
      enabled: !!zkopru
    }
  )
}
