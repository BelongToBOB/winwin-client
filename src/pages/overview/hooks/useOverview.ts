import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { OverviewData } from '@/types/registration'

export function useOverview(seminarId: string) {
  return useQuery({
    queryKey: qk.overview ? qk.overview(seminarId) : ['overview', seminarId],
    queryFn: async () => {
      const { data } = await api.get<OverviewData>('/overview', {
        params: { seminar_id: seminarId }
      })
      return data
    },
    staleTime: 1000 * 60 * 2
  })
}
