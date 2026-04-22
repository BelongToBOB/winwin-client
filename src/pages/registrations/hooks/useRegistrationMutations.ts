import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { qk } from '@/lib/queryKeys'

export function useCreateRegistration(filters: Record<string, string>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { registrant_id: string; seminar_id: string; reg_status?: string }) =>
      api.post('/registrations', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.registrations(filters) }),
  })
}

export function useUpdateRegistrationStatus(filters: Record<string, string>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reg_status }: { id: string; reg_status: string }) =>
      api.patch(`/registrations/${id}`, { reg_status }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.registrations(filters) }),
  })
}

export function useDeleteRegistration(filters: Record<string, string>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/registrations/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.registrations(filters) }),
  })
}

export function useCreateRegistrant() {
  return useMutation({
    mutationFn: (data: {
      first_name: string
      last_name: string
      nickname?: string
      email?: string
      phone?: string
      job_category?: string
    }) => api.post('/registrants', data).then(r => r.data),
  })
}

export function useUpdateRegistrationProfile(filters: Record<string, string>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ registrationId, ...data }: {
      registrationId: string
      loan_amount_range?: string
      loan_before?: boolean
      credit_banks?: string
      channels?: string
      objective?: string
      loan_problems?: string
    }) => api.patch(`/registration-profiles/${registrationId}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.registrations(filters) }),
  })
}

export function useUpdateReschedule(filters: Record<string, string>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reschedule_status, reschedule_note }: {
      id: string
      reschedule_status: string
      reschedule_note?: string
    }) => api.patch(`/registrations/${id}/reschedule`, { reschedule_status, reschedule_note }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.registrations(filters) }),
  })
}
