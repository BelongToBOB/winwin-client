import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'

export function useUpdateContact(overdueOnly: boolean) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: {
      id: string
      crm_stage?: string
      assigned_to?: string
      notes?: string
      next_followup?: string
      last_contacted?: string
    }) => api.patch(`/crm/contacts/${id}`, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.crmFollowups(overdueOnly) })
      qc.invalidateQueries({ queryKey: qk.crmStages() })
    },
  })
}
