import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

const PC_KEY = ['private-consult']

export function usePcStats() {
  return useQuery({
    queryKey: [...PC_KEY, 'stats'],
    queryFn: () => api.get('/private-consult/stats').then(r => r.data),
  })
}

export function usePcList(consultId?: string) {
  return useQuery({
    queryKey: [...PC_KEY, 'list', consultId],
    queryFn: () => api.get('/private-consult', { params: consultId ? { consult_id: consultId } : {} }).then(r => r.data),
  })
}

export function useUpdatePc() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/private-consult/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PC_KEY }),
  })
}

export function useDeletePc() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/private-consult/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PC_KEY }),
  })
}
