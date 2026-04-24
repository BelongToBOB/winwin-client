import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'

export interface BhcRegistration {
  id: string
  event_id: string
  full_name: string
  nickname: string
  phone: string
  facebook_name: string
  accounting_problem: string
  channel: string
  course_accept: string
  copyright_accept: string
  created_at: string
}

export function useBhcRegistrations(filters: Record<string, string>) {
  return useQuery({
    queryKey: qk.bhc(filters),
    queryFn: async () => {
      const { data } = await api.get<BhcRegistration[]>('/bhc', { params: filters })
      return data
    },
  })
}
