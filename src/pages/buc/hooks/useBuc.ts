import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

const BUC_KEY = ['buc']

export function useBucStats() {
  return useQuery({
    queryKey: [...BUC_KEY, 'stats'],
    queryFn: () => api.get('/buc/stats').then(r => r.data),
  })
}

export function useBucList(status?: string) {
  return useQuery({
    queryKey: [...BUC_KEY, 'list', status],
    queryFn: () => api.get('/buc', { params: status ? { status } : {} }).then(r => r.data),
  })
}

export function useCreateBuc() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.post('/buc', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BUC_KEY }),
  })
}

export function useUpdateBuc() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/buc/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BUC_KEY }),
  })
}

export function useDeleteBuc() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/buc/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BUC_KEY }),
  })
}

