import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { Registration } from '@/types/registration'

interface UseRegistrationsFilters {
  seminar_id?: string
  status?: string
  job?: string
  loan_range?: string
  q?: string
}

export function useRegistrations(filters: UseRegistrationsFilters) {
  return useQuery({
    queryKey: qk.registrations ? qk.registrations(filters) : ['registrations', filters],
    queryFn: async () => {
      const { data } = await api.get<Registration[]>('/registrations', {
        params: filters
      })
      return data
    },
    staleTime: 1000 * 60 * 2
  })
}
