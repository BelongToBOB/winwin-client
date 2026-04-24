import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'

export function useCreateBhc() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      full_name: string
      nickname: string
      phone: string
      facebook_name: string
      accounting_problem: string
      channel: string
      course_accept?: string
      copyright_accept?: string
    }) => api.post('/bhc', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bhc'] }),
  })
}

export function useUpdateBhc() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: {
      id: string
      full_name?: string
      nickname?: string
      phone?: string
      facebook_name?: string
      accounting_problem?: string
      channel?: string
    }) => api.patch(`/bhc/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bhc'] }),
  })
}

export function useDeleteBhc() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/bhc/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bhc'] }),
  })
}
