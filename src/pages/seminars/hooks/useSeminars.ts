import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'
import type { CourseEvent } from '@/types/registration'

export function useSeminars() {
  return useQuery({
    queryKey: qk.seminars(),
    queryFn: () => api.get<CourseEvent[]>('/course-events').then(r => r.data),
  })
}

export function useCreateSeminar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CourseEvent>) => api.post('/course-events', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.seminars() }),
  })
}

export function useUpdateSeminar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<CourseEvent> & { id: string }) =>
      api.patch(`/course-events/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.seminars() }),
  })
}

export function useDeleteSeminar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/course-events/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.seminars() }),
  })
}
