import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { CrmStage, Followup } from '@/types/crm'

export function useCrmStages() {
  return useQuery({
    queryKey: qk.crmStages(),
    queryFn: async () => {
      const { data } = await api.get<CrmStage[]>('/crm/stages')
      return data
    },
    staleTime: 1000 * 60 * 2
  })
}

interface UseCrmFollowupsFilters {
  seminar_id?: string
  overdue_only?: boolean
}

export function useCrmFollowups({ seminar_id, overdue_only }: UseCrmFollowupsFilters) {
  return useQuery({
    queryKey: qk.crmFollowups(overdue_only ?? false, seminar_id),
    queryFn: async () => {
      const { data } = await api.get<Followup[]>('/crm/followups', {
        params: { seminar_id, overdue_only }
      })
      return data
    },
    staleTime: 1000 * 60 * 2
  })
}
