import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { Interaction } from '@/types/interaction'

export function useInteractions(contactId: string | undefined) {
  return useQuery({
    queryKey: qk.interactions(contactId ?? ''),
    queryFn: () => api.get<Interaction[]>('/interactions', { params: { contact_id: contactId } }).then(r => r.data),
    enabled: !!contactId,
  })
}

export function useCreateInteraction(contactId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      contact_id: string
      channel?: string
      direction?: string
      content?: string
      outcome?: string
    }) => api.post('/interactions', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.interactions(contactId) }),
  })
}

export function useDeleteInteraction(contactId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/interactions/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.interactions(contactId) }),
  })
}
